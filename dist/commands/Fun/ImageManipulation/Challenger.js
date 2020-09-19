"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class default_1 extends Command_1.default {
    constructor(client) {
        super(client, "challenger", {
            aliases: ["challenger"],
            description: {
                content: "Draws an image over Super Smash Bros \"Challenger Approaching\" screen",
                usage: "challenger [user|image] [--silhoute]",
                examples: ["challenger"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "silhouted",
                    match: "flag",
                    flag: "silhoute"
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
    async exec(msg, { image, silhouted }) {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/challenger")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image, silhouted });
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "challenger.png" }] });
    }
}
exports.default = default_1;
