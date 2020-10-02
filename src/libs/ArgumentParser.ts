import type YumekoClient from "@yumeko/classes/Client";
import CustomError from "@yumeko/classes/CustomError";
import readdirRecursive from "@yumeko/util/ReaddirRecursive";
import { Message, Collection } from "discord.js";
import { Argument, Type, ArgumentTypeFunction } from "@yumeko/interfaces";
import { join } from "path";

export default class ArgumentParser {
    public types: Collection<string, Type> = new Collection();
    public constructor(public client: YumekoClient) {
        const path = join(__dirname, "../types");
        const files = readdirRecursive(path);
        for (const file of files) {
            const type: Type = new (require(file).default)();
            this.types.set(type.name, type);
        }
    }

    public async parse(msg: Message, args: Argument[]): Promise<{[key: string]: unknown}> {
        const result: {[key: string]: unknown} = {};
        const multipleResult: unknown[] = [];
        let multipleArg = "";
        args = args.slice(0);
        for (const arg of args) {
            const produce = arg.type ? this.getType(arg.type) : this.getType("boolean");
            let matched: string|void;
            if (!msg.args.length && arg.optional) continue;
            if (arg.match === "rest") {
                matched = msg.args.join(" ");
                msg.args = [];
            } else if (arg.match === "single") {
                if (msg.args.length) matched = msg.args.shift()!;
            } else if (arg.match === "flag") {
                const res = msg.args.filter(x => x.split("=")[0].startsWith(`--${arg.flag!}`))[0];
                const index = msg.args.indexOf(res);
                if (res) {
                    const [flag, inpt] = res.split("=");
                    matched = inpt || flag;
                    msg.args.splice(index, 1);
                } else matched = "";
            } else {
                multipleArg = arg.identifier;
                if (msg.args.length) {
                    matched = msg.args.shift()!;
                    if (msg.args.length) args.push(arg);
                }
            }
            let produced: unknown;
            let tries = 1;
            if (!matched && arg.default) matched = typeof arg.default === "function" ? arg.default(msg) : arg.default;
            try {
                if (!matched && arg.prompt) {
                    tries = 0;
                    throw new CustomError("!PARSING");
                }
                produced = produce(msg, matched as string);
            } catch (e) {
                if (e.name !== "!PARSING") throw e;
                produced = await this.prompting(msg, arg, e.message, tries);
            }
            // eslint-disable-next-line no-unused-expressions
            arg.match === "multiple" ? multipleResult.push(produced) : result[arg.identifier] = produced;
        }
        if (multipleResult.length) result[multipleArg] = multipleResult;
        return result;
    }

    public async prompting(msg: Message, arg: Argument, toSend: string, tries = 0): Promise<unknown> {
        let result: unknown;
        while (!result && tries < 3) {
            const sign = !tries ? "❓" : "❌";
            const prompt = !tries ? (typeof arg.prompt === "function" ? arg.prompt(msg) : arg.prompt) : toSend;
            await msg.channel.send(msg.ctx.lang("ARGUMENT_PARSER_PROMPT", sign, prompt!));
            const filter = (m: Message): boolean => m.author.id === msg.author.id;
            const responses = await msg.channel.awaitMessages(filter, { max: 1, time: 30000});
            if (!responses.size) throw new CustomError("CANCELED");
            let m = responses.first()!.content;
            if (m.toLowerCase() === "cancel")  {
                msg.channel.send(msg.ctx.lang("ARGUMENT_PARSER_CANCELED"));
                throw new CustomError("CANCELED");
            }
            if (m.toLowerCase() === "|cancel|") m = m.replace(/\|/g, "");
            const produce = this.getType(arg.type);
            try {
                result = produce(msg, m);
            } catch (e) {
                if (e.name === "!PARSING") toSend = e.message;
                else throw e;
            }
            tries++;
        }
        if (!result) {
            msg.channel.send(msg.ctx.lang("ARGUMENT_PARSER_NOT_UNDERSTAND", msg.author));
            throw new CustomError("!UNDERSTAND");
        }
        return result;
    }

    public getType(type: Argument["type"]): ArgumentTypeFunction {
        if (typeof type === "string") {
            const typeFunction = this.types.get(type) || this.types.get("boolean")!;
            return typeFunction.exec;
        }
        return type as ArgumentTypeFunction;
    }
}