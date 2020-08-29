"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class DemotivationalCommand extends Command_1.default {
    constructor(client) {
        super(client, "demotivational", {
            aliases: ["demotivational", "dmotivation", "dmtvtnl"],
            description: {
                content: "Draws an image and the text you specify as a demotivational poster",
                usage: "demotivational <title> || <text> || [user|image]",
                examples: ["demotivational YOU CAN'T DO IT || BECAUSE YOU'RE SO USELESS"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            splitBy: " || ",
            args: [
                {
                    identifier: "title",
                    match: "single",
                    type: "string",
                    prompt: "How the title about this ?"
                },
                {
                    identifier: "text",
                    match: "single",
                    type: "string",
                    prompt: "What text do you want to write ?"
                },
                {
                    identifier: "image",
                    match: "single",
                    type: "image",
                    default: (msg) => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
                }
            ]
        });
    }
    async exec(msg, { title, text, image }) {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/demotivational")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ title, text, image });
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "demotivational.png" }] });
    }
}
exports.default = DemotivationalCommand;
