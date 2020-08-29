"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const ReaddirRecursive_1 = __importDefault(require("@yumeko/util/ReaddirRecursive"));
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const path_1 = require("path");
class ArgumentParser {
    constructor(client) {
        this.client = client;
        this.types = new discord_js_1.Collection();
        const path = path_1.join(__dirname, "../types");
        const files = ReaddirRecursive_1.default(path);
        for (const file of files) {
            const type = new (require(file).default)();
            this.types.set(type.name, type);
        }
    }
    async parse(msg, args) {
        const result = {};
        const multipleResult = [];
        let multipleArg = "";
        args = args.slice(0);
        for (const arg of args) {
            const produce = arg.type ? this.getType(arg.type) : this.getType("boolean");
            let matched;
            if (!msg.args.length && arg.optional)
                continue;
            if (arg.match === "rest") {
                matched = msg.args.join(" ");
                msg.args = [];
            }
            else if (arg.match === "single") {
                if (msg.args.length)
                    matched = msg.args.shift();
            }
            else if (arg.match === "flag") {
                const res = msg.args.filter(x => x.split("=")[0].startsWith(`--${arg.flag}`))[0];
                const index = msg.args.indexOf(res);
                if (res) {
                    const [flag, inpt] = res.split("=");
                    matched = inpt || flag;
                    msg.args.splice(index, 1);
                }
                else
                    matched = "";
            }
            else if (arg.match === "multiple") {
                multipleArg = arg.identifier;
                if (msg.args.length) {
                    matched = msg.args.shift();
                    if (msg.args.length)
                        args.push(arg);
                }
            }
            let produced;
            let tries = 1;
            if (!matched && arg.default)
                matched = typeof arg.default === "function" ? arg.default(msg) : arg.default;
            try {
                if (!matched && arg.prompt) {
                    tries = 0;
                    throw new CustomError_1.default("!PARSING");
                }
                produced = produce(msg, matched);
            }
            catch (e) {
                if (e.name !== "!PARSING")
                    throw e;
                produced = await this.prompting(msg, arg, e.message, tries);
            }
            arg.match === "multiple" ? multipleResult.push(produced) : result[arg.identifier] = produced;
        }
        if (multipleResult.length)
            result[multipleArg] = multipleResult;
        return result;
    }
    async prompting(msg, arg, toSend, tries = 0) {
        let result;
        while (!result && tries < 3) {
            await msg.channel.send(common_tags_1.stripIndents `
                **${!tries ? "❓" : "❌"} |** ${!tries ? (typeof arg.prompt === "function" ? arg.prompt(msg) : arg.prompt) : toSend}
                **▫️ |** *You've \`30\` seconds to decide*
                **▫️ | ** *You can type \`cancel\` to cancel.*
                **▫️ | ** *Or if you want to type cancel use \`|cancel|\` instead*
            `);
            const filter = (m) => m.author.id === msg.author.id;
            const responses = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });
            if (!responses.size)
                throw new CustomError_1.default("CANCELED");
            let m = responses.first().content;
            if (m.toLowerCase() === "cancel") {
                msg.channel.send("👌 **| Canceled**");
                throw new CustomError_1.default("CANCELED");
            }
            if (m.toLowerCase() === "|cancel|")
                m = m.replace(/\|/g, "");
            const produce = this.getType(arg.type);
            try {
                result = produce(msg, m);
            }
            catch (e) {
                if (e.name === "!PARSING")
                    toSend = e.message;
                else
                    throw e;
            }
            tries++;
        }
        if (!result) {
            msg.channel.send(`**🤷 | ${msg.author}, Look like you don't know how to run this command.**`);
            throw new CustomError_1.default("!UNDERSTAND");
        }
        return result;
    }
    getType(type) {
        if (typeof type === "string") {
            const typeFunction = this.types.get(type) || this.types.get("boolean");
            return typeFunction.exec;
        }
        return type;
    }
}
exports.default = ArgumentParser;
