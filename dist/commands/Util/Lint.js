"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const discord_js_1 = require("discord.js");
const Util_1 = require("@yumeko/util/Util");
const CodeLinter_1 = require("@yumeko/util/CodeLinter");
const common_tags_1 = require("common-tags");
const ecmaVersions = [3, 5, 6, 7, 8, 9, 10, 11, 2015, 2016, 2017, 2018, 2019, 2020];
class default_1 extends Command_1.default {
    constructor(client) {
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
                    type: (_, content) => {
                        const typeNumber = this.collector.runner.argsParser.getType("number");
                        const result = typeNumber(_, content);
                        if (!ecmaVersions.includes(result))
                            throw new CustomError_1.default("!PARSING", `**Unsupported ECMA version. only supported: ${ecmaVersions.map(x => `\`${x}\``).join(", ")}**`);
                        return result;
                    }
                },
                {
                    identifier: "script",
                    match: "rest",
                    prompt: "What code do you want to lint ?",
                    type: (_, content) => {
                        const typeCode = this.collector.runner.argsParser.getType("code");
                        const result = typeCode(_, content);
                        if (!result.lang || !["js", "javascript", "json"].includes(result.lang))
                            throw new CustomError_1.default("!PARSING", "Unsupported language. only supported `Javascript` and `JSON`**");
                        return result;
                    }
                }
            ]
        });
    }
    exec(msg, { script, ecma }, send = true) {
        const embed = new discord_js_1.MessageEmbed().setColor("RED");
        if (script.lang === "json") {
            try {
                JSON.parse(script.code);
                msg.react("734220684825329775");
                return true;
            }
            catch (e) {
                embed.setDescription(common_tags_1.stripIndents `
                    ⛔ **Error**
                    ${Util_1.codeBlock("js", String(e))}
                `);
                if (send)
                    msg.ctx.send(embed);
                return embed;
            }
        }
        const errors = CodeLinter_1.lint(script.code, ecma, { "no-console": 0 });
        if (!errors.length) {
            msg.react("734220684825329775");
            return true;
        }
        embed.setDescription(common_tags_1.stripIndents `
            ⛔ **Errors**
            ${Util_1.codeBlock("js", errors.map(x => `- [${x.line}:${x.column}] ${x.message}`).join("\n"))}
            🔗 **Annotated**
            ${Util_1.codeBlock("js", this.anotate(script.code, errors))}
        `);
        if (send)
            msg.ctx.send(embed);
        return embed;
    }
    async handleReact(msg, script) {
        const result = this.exec(msg, { script, ecma: 2018 }, false);
        if (typeof result === "boolean")
            return result;
        await msg.react("734220683445403749");
        await msg.react("🔎");
        const filter = (mreact, user) => mreact.emoji.name === "🔎" && msg.author.id === user.id;
        const responses = await msg.awaitReactions(filter, { max: 1, time: 60000 });
        if (!responses.size)
            return false;
        msg.ctx.send(result);
        return false;
    }
    anotate(code, errors) {
        const splitted = code.split("\n");
        const results = [];
        for (const error of errors) {
            const line = splitted[error.line - 1];
            const anotation = `${" ".repeat(error.column - 1)}^ `;
            const reason = `[${error.line}:${error.column}] ${error.message}`;
            results.push(`${line}\n${anotation}\n${reason}`);
        }
        return Util_1.trimArray(results).join("\n");
    }
}
exports.default = default_1;
