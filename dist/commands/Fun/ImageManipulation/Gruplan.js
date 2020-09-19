"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class default_1 extends Command_1.default {
    constructor(client) {
        super(client, "gru-plan", {
            aliases: ["gru-plan"],
            description: {
                content: "Sends a Gru's Plan meme with steps of your choice",
                usage: "gru-plan <firstStep> || <secondStep> || <thirdStep>",
                examples: ["gru-plan I don't know || about || this meme"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            splitBy: " || ",
            args: [
                {
                    identifier: "firstStep",
                    match: "single",
                    type: "string",
                    prompt: "What the first step of your plan ?"
                },
                {
                    identifier: "secondStep",
                    match: "single",
                    type: "string",
                    prompt: "What the second step of your plan ?"
                },
                {
                    identifier: "thirdStep",
                    match: "single",
                    type: "string",
                    prompt: "What the third step of your plan ?"
                }
            ]
        });
    }
    async exec(msg, { firstStep, secondStep, thirdStep }) {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/gru-plan")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ firstStep, secondStep, thirdStep });
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "gru-plan.png" }] });
    }
}
exports.default = default_1;
