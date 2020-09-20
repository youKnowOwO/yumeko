import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

const faces = ["(・`ω´・)", ";;w;;", "owo", "UwU", ">w<", "^w^"];

@DeclareCommand("owoify", {
    aliases: ["owoify"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_TEXT_MANIPULATION_OWOIFY_DESCRIPTION"),
        usage: "owoify <text>",
        examples: ["owoify good boy"]
    },
    category: "fun",
    args: [
        {
            identifier: "text",
            match: "rest",
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_TEXT_MANIPULATION_PROMPT"),
            type: "string"
        }
    ]
})
export default class extends Command {
    @constantly
    public exec(msg: Message, { text } : { text: string }): Promise<Message> {
        text = text.replace(/(?:r|l)/g, "w")
            .replace(/(?:R|L)/g, "W")
            .replace(/n([aeiou])/g, "ny$1")
            .replace(/N([aeiou])/g, "Ny$1")
            .replace(/N([AEIOU])/g, "NY$1")
            .replace(/ove/g, "uv")
            .replace(/!+/g, ` ${faces[Math.floor(Math.random() * faces.length)]} `)
            .trim();
        return msg.ctx.send(text);
    }
}