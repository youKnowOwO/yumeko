import YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { DeclareCommand } from "@yumeko/decorators";
import CustomError from "@yumeko/classes/CustomError";
import { oneLineTrim } from "common-tags";

@DeclareCommand("language", {
    aliases: ["language", "lang", "setlang", "locale"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_LANGUAGE_DESCRIPTION"),
        usage: "language [lang]",
        examples: ["language", "language id_ID", "language 1"]
    },
    category: "admin",
    permissions: {
        user: ["MANAGE_GUILD"]
    },
    args: [
        {
            identifier: "language",
            match: "single",
            type: (msg, content): string => {
                const { langs } = msg.client as YumekoClient;
                let lang: string | void;
                if (!isNaN(Number(content))) lang = langs.keyArray()[Number(content) - 1];
                else if (langs.has(content)) lang = content;
                if (!lang) throw new CustomError("!PARSING", msg.guild!.loc.get("COMMAND_LANGUAGE_NOT_FOUND", content));
                return lang;
            },
            optional: true
        }
    ]
})
export default class extends Command {
    public async exec(msg: Message, { language }: { language?: string }): Promise<Message> {
        if (language) {
            msg.guild!.loc.lang = language;
            const currentLang: [string, string] = [
                msg.guild!.loc.get("META_NAME"),
                msg.guild!.loc.get("META_EMOJI")
            ];
            return msg.ctx.send(msg.guild!.loc.get("COMMAND_LANGUAGE_SET", ...currentLang));
        }
        const currentLang: [string, string] = [
            msg.guild!.loc.get("META_NAME"),
            msg.guild!.loc.get("META_EMOJI")
        ];
        let index = 0;
        const list = this.client.langs.map((x, i) => oneLineTrim`
            \`${++index}.\` 
            **${x.META_NAME()}** 
            \`${i}\` 
            ${x.META_EMOJI()}
        `).join("\n");
        return msg.ctx.send(msg.guild!.loc.get("COMMAND_LANGUAGE_LIST", msg.prefix!, list, ...currentLang));
    }
}