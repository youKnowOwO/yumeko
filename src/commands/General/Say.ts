import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import { Message } from "discord.js";

export default class SayCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "say", {
            aliases: ["say"],
            description: {
                content: "Let me repeat what you want",
                usage: "say <text>",
                examples: ["ping"]
            },
            category: "general",
            args: [
                {
                    identifier: "text",
                    type: "string",
                    match: "rest",
                    prompt: "What text do you want me to repeaat ?"
                }
            ]
        });
    }

    public exec(msg: Message, { text }: { text: string }): void {
        msg.channel.send(text);
    }
}