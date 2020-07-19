import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import type { Message } from "discord.js";

const responses = require("../../../assets/json/8ball.json");

export default class EightBallCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "8ball", {
            aliases: ["8ball"],
            description: {
                content: "Ask to the magic 8ball",
                usage: "8ball <question>",
                examples: ["8ball are you right ?"]
            },
            category: "fun",
            args: [
                {
                    identifier: "text",
                    match: "rest",
                    prompt: "What question do you want to ask  ?",
                    type: "string"
                }
            ]
        });
    }

    public exec(msg: Message): void {
        const response = responses[Math.round(Math.random()*responses.length)] || responses[0];
        msg.ctx.send(`🎱 **| ${response}**`);
    }
}