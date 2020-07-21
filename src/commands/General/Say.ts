import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import type { Message } from "discord.js";

export default class SayCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "say", {
            aliases: ["say"],
            description: {
                content: "Let me repeat what you want",
                usage: "say <text> [--delete]",
                examples: ["say salam"]
            },
            category: "general",
            args: [
                {
                    identifier: "isDelete",
                    match: "flag",
                    flag: "delete"
                },
                {
                    identifier: "text",
                    type: "string",
                    match: "rest",
                    prompt: "What text do you want me to repeaat ?"
                }
            ]
        });
    }

    public exec(msg: Message, { text, isDelete }: { text: string; isDelete: boolean }): Promise<Message> {
        if (isDelete) msg.delete().catch();
        return msg.ctx.send(text);
    }
}