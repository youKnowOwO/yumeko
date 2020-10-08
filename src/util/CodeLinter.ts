import type YumekoClient from "@yumeko/classes/Client";
import LintCommand from "@yumeko/commands/Utility/Lint";
import type { Message } from "discord.js";
import { TypeCodeReturn } from "@yumeko/interfaces";
import { Linter, Rule } from "eslint";
import { stripIndents } from "common-tags";

const linter = new Linter();
const rules = linter.getRules();

export function lint(content: string, ecmaVersion: Linter.ParserOptions["ecmaVersion"], rules: Partial<Linter.RulesRecord> ): Linter.LintMessage[] {
    if (/\bawait\b/i.test(content)) content = stripIndents`
        (async function () {
            ${content}
        })()
    `;
    const errors = linter.verify(content, {
        extends: "eslint:recommended",
        parserOptions: {
            ecmaVersion,
            sourceType: "module"
        },
        env: {
            es6: true,
            node: true
        },
        rules
    });
    return errors;
}

export function getRule(query: string): Rule.RuleModule|void {
    return rules.get(query);
}

export function handle(msg: Message): Promise<boolean> {
    if (msg.author.bot || !msg.guild ||
         !msg.guild.available || !msg.guild.me!.hasPermission(["ADD_REACTIONS", "SEND_MESSAGES", "EMBED_LINKS"])) return Promise.resolve(false);
    const { collector } = (msg.client as YumekoClient);
    if (collector.runner.getPrefix(msg)) return Promise.resolve(false);
    const typeCode = collector.runner.argsParser.getType("code");
    try {
        const script: TypeCodeReturn = typeCode(msg, msg.content) as any;
        if (!script.lang) throw new Error();
        if (!["js", "javascript", "json"].includes(script.lang.toLowerCase())) throw new Error();
        return (collector.commands.get("lint") as LintCommand).handleReact(msg, script);
    } catch {
        return Promise.resolve(false);
    }
}