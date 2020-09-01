"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const eightBallResponse = require("../../../assets/json/8ball.json");
class EightBallCommand extends Command_1.default {
    constructor(client) {
        super(client, "8ball", {
            aliases: ["8ball"],
            description: {
                content: (msg) => msg.guild.loc.get("COMMAND_8BALL_DESCRIPTION"),
                usage: "8ball <question>",
                examples: ["8ball are you right ?"]
            },
            category: "fun",
            args: [
                {
                    identifier: "text",
                    match: "rest",
                    prompt: (msg) => msg.guild.loc.get("COMMAND_8BALL_PROMPT"),
                    type: "string"
                }
            ]
        });
    }
    exec(msg) {
        const responses = eightBallResponse[msg.guild.loc.lang] || eightBallResponse.en_US;
        const response = responses[Math.round(Math.random() * responses.length)] || responses[0];
        return msg.ctx.send(`🎱 **| ${response}**`);
    }
}
exports.default = EightBallCommand;
