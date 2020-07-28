import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import CustomError from "../../classes/CustomError";
import type { Message, Snowflake } from "discord.js";
import { TypeCodeReturn } from "../../interfaces";
import { codeBlock, hastebin } from "../../util/Util";
import { exec } from "../../util/Myriad";

const languages: [string, string[]][]= [
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

export default class CodeCommand extends Command {
    public session: Map<Snowflake, string> = new Map();
    public constructor (client: YumekoClient) {
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
                    type: (_: Message, content: string): TypeCodeReturn => {
                        const typeCode = this.collector!.runner.argsParser.getType("code");
                        const result: TypeCodeReturn = typeCode(_, content) as any;
                        if (!result.lang || !languages.some(x => x[1].includes(result.lang!.toLowerCase()))) throw new CustomError("!PARSING", `**Unsupported language. only supported: ${languages.map(x => `\`${x[0]}\``).join(", ")}**`);
                        return result;
                    }
                }
            ]
        });
    }

    public exec(msg: Message, { script }: { script: TypeCodeReturn }): Promise<Message>|Message {
        const session = this.session.get(msg.author.id);
        if (session) return msg.ctx.send(`⚙️ **| Please wait till your previous code evaluate.\n${session}**`);
        const m = msg.channel.send("⚙️ **| Evaluating...**");
        const lang = languages.find(x => x[1].includes(script.lang!.toLowerCase()))![0];
        this.session.set(msg.author.id, msg.url);
        exec(this.client, script.code, lang).then(this.resolve.bind(this, msg, m, lang));
        return msg;
    }

    public async resolve(msg: Message, awaitMessage: Promise<Message>, lang: string, [succes, result]: [boolean, string]): Promise<Message> {
        (await awaitMessage).delete();
        this.session.delete(msg.author.id);
        const disp = succes ? "✅ | Succes" : "❌ | Failed";
        let toSend = `**${disp} ${codeBlock(lang, result)}**`;
        if (toSend.length >= 2000)  toSend = `**${disp}\n${await hastebin(result, lang)}**`;
        return msg.ctx.send(toSend);
    }
}