"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class DexterCommand extends Command_1.default {
    constructor(client) {
        super(client, "dexter", {
            aliases: ["dexter"],
            description: {
                content: "Draws an image avatar over the screen of Dexter from Pokémon",
                usage: "dexter [user|image]",
                examples: ["dexter"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "image",
                    match: "rest",
                    type: "image",
                    default: (msg) => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
                }
            ]
        });
    }
    async exec(msg, { image }) {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/dexter")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image });
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "dexter.png" }] });
    }
}
exports.default = DexterCommand;
