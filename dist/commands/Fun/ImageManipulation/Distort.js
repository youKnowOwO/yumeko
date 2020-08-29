"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class DistortCommand extends Command_1.default {
    constructor(client) {
        super(client, "distort", {
            aliases: ["distort"],
            description: {
                content: "Draws an image but distorted",
                usage: "distort [user|image] [--level=<number>]",
                examples: ["distort"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "level",
                    match: "flag",
                    type: "number",
                    flag: "level",
                    default: 10
                },
                {
                    identifier: "image",
                    match: "rest",
                    type: "image",
                    default: (msg) => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
                }
            ]
        });
    }
    async exec(msg, { image, level }) {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/distort")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image, level });
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "distort.png" }] });
    }
}
exports.default = DistortCommand;
