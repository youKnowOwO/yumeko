"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const en_US_1 = require("@yumeko/langs/en_US");
class default_1 extends Command_1.default {
    constructor(client, react = "amazed") {
        super(client, react, {
            aliases: [react],
            description: {
                content: (msg) => msg.ctx.lang("COMMAND_REACTIONS_DESCRIPTION", en_US_1.Reactions[react]),
                usage: react,
                examples: [react]
            },
            permissions: {
                client: ["ATTACH_FILES"]
            },
            category: "reactions",
        });
        this.api = "https://emilia-api.xyz/api/";
    }
    async exec(msg) {
        const { raw: attachment } = await node_superfetch_1.default.get(`${this.api}${this.identifier}`)
            .set("Authorization", `Bearer ${process.env.EMIAPI}`);
        return msg.ctx.send({ files: [{ attachment, name: `${this.identifier}.gif` }] });
    }
}
exports.default = default_1;
