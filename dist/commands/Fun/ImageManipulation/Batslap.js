"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class default_1 extends Command_1.default {
    constructor(client) {
        super(client, "batslap", {
            aliases: ["batslap"],
            description: {
                content: "A batman slapping meme",
                usage: "batslap <user>",
                examples: ["batslap @unknown"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "user",
                    match: "rest",
                    type: "user",
                    prompt: "Which user do you want to slap ?"
                }
            ]
        });
    }
    async exec(msg, { user }) {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/batslap")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({
            slapper: msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true }),
            slapped: user.displayAvatarURL({ format: "png", size: 512, dynamic: true })
        });
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "batslap.png" }] });
    }
}
exports.default = default_1;
