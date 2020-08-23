import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";

export default class ClapifyCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "clapify", {
            aliases: ["clapify"],
            description: {
                content: "Convert text to clapify way",
                usage: "clapify <text>",
                examples: ["clapify good boy"]
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
        return msg.ctx.send(`👏${text.replace(/ +/g,"👏")}👏`);
    }
}