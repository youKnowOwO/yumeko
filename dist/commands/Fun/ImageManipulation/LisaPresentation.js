"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class default_1 extends Command_1.default {
    constructor(client) {
        super(client, "lisa-presentation", {
            aliases: ["lisa-presentation", "lisapresentation", "lisap"],
            description: {
                content: "Sends a \"Lisa Presentation\" meme with the presentation of your choice",
                usage: "lisa-presentation <text>",
                examples: ["lisa-presentation idk"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "text",
                    match: "rest",
                    type: "string",
                    prompt: "What the text to be presented ?"
                }
            ]
        });
    }
    async exec(msg, { text }) {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/lisa-presentation")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ text });
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "lisa-presentation.png" }] });
    }
}
exports.default = default_1;
