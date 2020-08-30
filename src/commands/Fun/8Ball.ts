import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";

const eightBallResponse: {[key: string]: string[]} = require("../../../assets/json/8ball.json");

export default class EightBallCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "8ball", {
            aliases: ["8ball"],
            description: {
                content: (msg): string => msg.guild!.loc.get("COMMAND_8BALL_DESCRIPTION"),
                usage: "8ball <question>",
                examples: ["8ball are you right ?"]
            },
            category: "fun",
            args: [
                {
                    identifier: "text",
                    match: "rest",
                    prompt: (msg): string => msg.guild!.loc.get("COMMAND_8BALL_PROMPT"),
                    type: "string"
                }
            ]
        });
    }

    public exec(msg: Message): Promise<Message> {
        const responses = eightBallResponse[msg.guild!.loc.lang] || eightBallResponse.en_US;
        const response = responses[Math.round(Math.random()*responses.length)] || responses[0];
        return msg.ctx.send(`🎱 **| ${response}**`);
    }
}