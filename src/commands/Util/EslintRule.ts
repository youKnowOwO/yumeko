import Command from "@yumeko/classes/Command";
import { Message, MessageEmbed } from "discord.js";
import { DeclareCommand } from "@yumeko/decorators";
import { getRule } from "@yumeko/util/CodeLinter";

@DeclareCommand("eslint-rule", {
    aliases: ["eslint-rule", "lint-rule"],
    description: {
        content: "Get information on an eslint rule",
        usage: "eslint-rule <query>",
        examples: ["eslint-rule no-eval"]
    },
    category: "utility",
    permissions: {
        client: ["EMBED_LINKS"]
    },
    args: [
        {
            identifier: "query",
            match: "rest",
            type: "string",
            prompt: "What rule do you want to see ?"
        }
    ]
})
export default class EslintRule extends Command {
    public exec(msg: Message, { query }: { query: string }): Promise<Message> {
        query = query.toLowerCase();
        const rule = getRule(query);
        if (!rule || !rule.meta) return msg.ctx.send("🚫 No result found");
        const embed = new MessageEmbed()
            .setAuthor("ESLint", "https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/358/full/eslintlogo.png", "https://eslint.org/")
            .setColor("#3A33D1")
            .setURL(rule.meta.docs!.url!)
            .setTitle(`${query} (${rule.meta.docs!.category}) ${rule.meta.docs!.recommended ? "[RECOMMENDED]": ""}`)
            .setDescription(rule.meta.docs!.description);
        if (rule.meta.messages) {
            const messages = Object.keys(rule.meta.messages)
                .map(x => `• **${x}:** ${rule.meta!.messages![x]}`)
                .join("\n");
            embed.addField("Messages", messages);
        }
        return msg.ctx.send(embed);
    }
}