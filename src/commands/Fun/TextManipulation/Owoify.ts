import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";

const faces = ["(・`ω´・)", ";;w;;", "owo", "UwU", ">w<", "^w^"];

export default class OwoifyCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "owoify", {
            aliases: ["owoify"],
            description: {
                content: "Convert text to owoify way",
                usage: "owoify <text>",
                examples: ["owoify good boy"]
            },
            category: "fun",
            args: [
                {
                    identifier: "text",
                    match: "rest",
                    prompt: "What text do you want to convert ?",
                    type: "string"
                }
            ]
        });
    }

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