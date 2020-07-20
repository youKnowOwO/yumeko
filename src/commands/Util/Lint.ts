import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import CustomError from "../../classes/CustomError";
import type { Linter } from "eslint";
import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import { TypeCodeReturn } from "../../interfaces";
import { codeBlock, trimArray } from "../../util/Util";
import { lint } from "../../util/CodeLinter";
import { stripIndents } from "common-tags";

const ecmaVersions = [3, 5, 6, 7, 8, 9, 10, 11, 2015, 2016, 2017, 2018, 2019, 2020];

export default class LintCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "lint", {
            aliases: ["lint"],
            description: {
                content: "Lint your code",
                usage: "lint <code> [--ecma=<version>]",
                examples: ["lint \\`\\`\\`1+1\\`\\`\\`"]
            },
            category: "utility",
            permissions: {
                client: ["EMBED_LINKS", "ADD_REACTIONS"]
            },
            args: [
                {
                    identifier: "ecma",
                    match: "flag",
                    flag: "ecma",
                    default: 2018,
                    type: (_: Message, content: string): Linter.ParserOptions["ecmaVersion"] => {
                        const typeNumber = this.collector!.runner.argsParser.getType("number");
                        const result: number = typeNumber(_, content) as any;
                        if (!ecmaVersions.includes(result)) throw new CustomError("!PARSING", `**Unsupported ECMA version. only supported: ${ecmaVersions.map(x => `\`${x}\``).join(", ")}**`);
                        return result as Linter.ParserOptions["ecmaVersion"];
                    }
                },
                {
                    identifier: "script",
                    match: "rest",
                    prompt: "What code do you want to lint ?",
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

    public exec(msg: Message, { script, ecma }: { script: TypeCodeReturn; ecma: Linter.ParserOptions["ecmaVersion"]}, send = true): MessageEmbed|boolean {
        const embed = new MessageEmbed().setColor("RED");
        if (script.lang === "json") {
            try {
                JSON.parse(script.code);
                msg.react("734220684825329775");
                return true;
            } catch (e) {
                embed.setDescription(stripIndents`
                    ⛔ **Error**
                    ${codeBlock("js", String(e))}
                `);
                if (send) msg.ctx.send(embed);
                return embed;
            }
        }
        const errors = lint(script.code, ecma, { "no-console": 0 });
        if (!errors.length) {
            msg.react("734220684825329775");
            return true;
        }
        embed.setDescription(stripIndents`
            ⛔ **Errors**
            ${codeBlock("js", errors.map(x => `- [${x.line}:${x.column}] ${x.message}`).join("\n"))}
            🔗 **Annotated**
            ${codeBlock("js", this.anotate(script.code, errors))}
        `);
        if (send) msg.ctx.send(embed);
        return embed;
    }

    public async handleReact(msg: Message, script: TypeCodeReturn): Promise<boolean> {
        const result = this.exec(msg, { script, ecma: 2018 }, false);
        if (typeof result === "boolean")  return result;
        await msg.react("734220683445403749");
        await msg.react("🔎");
        const filter = (mreact: MessageReaction, user: User): boolean => mreact.emoji.name === "🔎" && msg.author.id === user.id;
        const responses = await msg.awaitReactions(filter, { max: 1, time: 60000 });
        if (!responses.size) return false;
        msg.ctx.send(result);
        return false;
    }

    public anotate(code: string, errors: Linter.LintMessage[]): string {
        const splitted = code.split("\n");
        const results: string[] = [];
        for(const error of errors) {
            const line = splitted[error.line - 1];
            const anotation = `${" ".repeat(error.column - 1)}^ `;
            const reason = `[${error.line}:${error.column}] ${error.message}`;
            results.push(`${line}\n${anotation}\n${reason}`);
        }
        return trimArray(results).join("\n");
    }
}