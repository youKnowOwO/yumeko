"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const Util_1 = require("@yumeko/util/Util");
const Myriad_1 = require("@yumeko/util/Myriad");
const languages = [
    ["apl", ["apl"]],
    ["bash", ["bash", "sh"]],
    ["brainfuck", ["brainfuck", "bf"]],
    ["c", ["c"]],
    ["cpp", ["cpp"]],
    ["csharp", ["csharp", "cs"]],
    ["elixir", ["elixir"]],
    ["erlang", ["erlang", "erl"]],
    ["fsharp", ["fsharp", "fs"]],
    ["go", ["golang", "go"]],
    ["haskell", ["haskell", "hs"]],
    ["idris", ["idris", "idr"]],
    ["java", ["java"]],
    ["javascript", ["javascript", "js"]],
    ["julia", ["julia"]],
    ["lua", ["lua"]],
    ["nim", ["nim", "nimrod"]],
    ["ocaml", ["ocaml", "ml"]],
    ["pascal", ["pascal", "pas", "freepascal"]],
    ["perl", ["perl", "pl"]],
    ["php", ["php"]],
    ["prolog", ["prolog"]],
    ["python", ["python", "py"]],
    ["r", ["r"]],
    ["racket", ["lisp"]],
    ["ruby", ["ruby", "rb"]],
    ["rust", ["rust", "rs"]],
    ["typescript", ["typescript", "ts"]]
];
class default_1 extends Command_1.default {
    constructor(client) {
        super(client, "code", {
            aliases: ["code", "$"],
            description: {
                content: "Execute your code!",
                usage: "code <code> [--ecma=<version>]",
                examples: ["code \\`\\`\\`js\n1+1\\`\\`\\`"]
            },
            category: "utility",
            permissions: {
                client: ["ADD_REACTIONS"]
            },
            args: [
                {
                    identifier: "script",
                    match: "rest",
                    type: (_, content) => {
                        const typeCode = this.collector.runner.argsParser.getType("code");
                        const result = typeCode(_, content);
                        if (!result.lang || !languages.some(x => x[1].includes(result.lang.toLowerCase())))
                            throw new CustomError_1.default("!PARSING", `**Unsupported language. only supported: ${languages.map(x => `\`${x[0]}\``).join(", ")}**`);
                        return result;
                    }
                }
            ]
        });
        this.session = new Map();
    }
    exec(msg, { script }) {
        const session = this.session.get(msg.author.id);
        if (session)
            return msg.ctx.send(`⚙️ **| Please wait till your previous code evaluate.\n${session}**`);
        const m = msg.channel.send("⚙️ **| Evaluating...**");
        const lang = languages.find(x => x[1].includes(script.lang.toLowerCase()))[0];
        this.session.set(msg.author.id, msg.url);
        Myriad_1.exec(this.client, script.code, lang).then(this.resolve.bind(this, msg, m, lang));
        return msg;
    }
    async resolve(msg, awaitMessage, lang, [succes, result]) {
        (await awaitMessage).delete();
        this.session.delete(msg.author.id);
        const disp = succes ? "✅ | Succes" : "❌ | Failed";
        let toSend = `**${disp} ${Util_1.codeBlock(lang, result)}**`;
        if (toSend.length >= 2000)
            toSend = `**${disp}\n${await Util_1.hastebin(result, lang)}**`;
        return msg.ctx.send(toSend);
    }
}
exports.default = default_1;
