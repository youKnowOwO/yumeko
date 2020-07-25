/* import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import CustomError from "../../classes/CustomError";
import type { Message } from "discord.js";
import { TypeCodeReturn } from "../../interfaces";
import { codeBlock, hastebin } from "../../util/Util";
import { stripIndents } from "common-tags";

export default class CodeCommand extends Command {
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
                        if (!result.lang || !["js", "javascript", "json"].includes(result.lang)) throw new CustomError("!PARSING", "Unsupported language. only supported `Javascript` and `JSON`**");
                        return result;
                    }
                }
            ]
        });
    }

    public async eval(code string, pang)
} */