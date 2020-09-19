"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
class default_1 extends Command_1.default {
    constructor(client) {
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
    exec(msg, { text }) {
        return msg.ctx.send(`👏${text.replace(/ +/g, "👏")}👏`);
    }
}
exports.default = default_1;
