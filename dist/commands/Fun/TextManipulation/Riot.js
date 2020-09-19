"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
class default_1 extends Command_1.default {
    constructor(client) {
        super(client, "riot", {
            aliases: ["riot"],
            description: {
                content: "Convert text to riot way",
                usage: "riot <text>",
                examples: ["riot hahaha"]
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
    exec(msg, { text }) {
        return msg.ctx.send(`ヽ༼ຈل͜ຈ༽ﾉ ${text.toUpperCase()} ヽ༼ຈل͜ຈ༽ﾉ`);
    }
}
exports.default = default_1;
