"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class FusionCommand extends Command_1.default {
    constructor(client) {
        super(client, "fusion", {
            aliases: ["fusion"],
            description: {
                content: "Fusion 2 user",
                usage: "fusion <user> [user]",
                examples: ["fusion @unknown"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "user",
                    match: "single",
                    type: "user",
                    prompt: "Which user do you want to fusion ?"
                },
                {
                    identifier: "user2",
                    match: "single",
                    type: "user",
                    default: (msg) => msg.author.id
                }
            ]
        });
    }
    async exec(msg, { user, user2 }) {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/fusion")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({
            baseImage: user2.displayAvatarURL({ format: "png", size: 512, dynamic: true }),
            overlayImage: user.displayAvatarURL({ format: "png", size: 512, dynamic: true })
        });
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "fusion.png" }] });
    }
}
exports.default = FusionCommand;
