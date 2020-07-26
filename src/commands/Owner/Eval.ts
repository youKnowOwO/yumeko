import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import Stopwatch from "../../util/Stopwarch";
import type { Message } from "discord.js";
import { inspect } from "util";
import { hastebin, codeBlock, escapeRegex } from "../../util/Util";

interface ReturnEval {
    time: string;
    result: string;
    succes: boolean;
}

export default class EvalCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "eval", {
            aliases: ["eval"],
            description: {
                content: "Eval Javascript Anotation",
                usage: "eval <code>",
                examples: ["eval 1+1"]
            },
            category: "owner",
            devOnly: true,
            args: [
                {
                    identifier: "isAsync",
                    match: "flag",
                    flag: "async"
                },
                {
                    identifier: "isHide",
                    match: "flag",
                    flag: "hide"
                },
                {
                    identifier: "showStack",
                    match: "flag",
                    flag: "stack"
                },
                {
                    identifier: "depth",
                    match: "flag",
                    type: "number",
                    flag: "depth",
                    default: 0
                },
                {
                    identifier: "code",
                    type: "string",
                    match: "rest",
                    prompt: "What code do you want me to evaluate ?"
                }
            ]
        });
    }

    public async exec(msg: Message, { isAsync, isHide, showStack, depth, code }: { isAsync: boolean; isHide: boolean; showStack: boolean; depth: number; code: string }): Promise<Message> {
        const { succes, result, time } = await this.eval(msg, code, depth, isAsync, showStack);
        if (isHide) return msg;
        const emoji = msg.guild!.me!.hasPermission("USE_EXTERNAL_EMOJIS") ?
            (succes ? "<:right:734220684825329775>" : "<:wrong:734220683445403749>") :
            (succes ? "❌" : "✅");
        let toSend = `${emoji} **| ${time}**\n${codeBlock("js", result)}`;
        if (toSend.length >= 2000) toSend = `${emoji} **| ${time}\n${await hastebin(result, "js")}**`;
        return msg.ctx.send(toSend);
    }

    public async eval(msg: Message, code: string,  depth: number, isAsync: boolean, showStack: boolean): Promise<ReturnEval> {
        const stopwatch = new Stopwatch();
        let isPromise = false;
        let succes = false;
        let syncTime: string|void;
        let asyncTime: string|void;
        let result: any;
        try {
            // eslint-disable-next-line no-eval
            let evaled = eval(isAsync ? `(async () => { ${code} })()` : code);
            syncTime = stopwatch.toString();
            if (evaled instanceof Promise && typeof evaled.then === "function" && typeof evaled.catch === "function") {
                evaled = await evaled;
                isPromise = true;
                asyncTime = stopwatch.toString();
            }
            result = evaled;
            succes = true;
        } catch(e) {
            if (!syncTime) syncTime = stopwatch.toString();
            if (isPromise && !asyncTime) asyncTime = stopwatch.toString();
            result = showStack ? e.stack : String(e);
        }
        result = typeof result === "string" ? result : inspect(result, { depth });
        result = this.replaceSensitive(result);
        const time = asyncTime ? `${syncTime}<${asyncTime}>` : syncTime;
        return { succes, result, time };
    }

    replaceSensitive(str: string): string {
        const regex = new RegExp(escapeRegex(this.client.token!), "g");
        return str.replace(regex, "[TOKEN :)]");
    }
}