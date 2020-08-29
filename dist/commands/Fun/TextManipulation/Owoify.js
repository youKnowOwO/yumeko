"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const faces = ["(・`ω´・)", ";;w;;", "owo", "UwU", ">w<", "^w^"];
class OwoifyCommand extends Command_1.default {
    constructor(client) {
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
    exec(msg, { text }) {
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
exports.default = OwoifyCommand;
