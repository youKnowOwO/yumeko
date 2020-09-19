"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const Util_1 = require("@yumeko/util/Util");
class default_1 extends Command_1.default {
    constructor(client, react = "amazed") {
        super(client, react, {
            aliases: [react],
            description: {
                content: `Random ${Util_1.firstUpperCase(react)} image.`,
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
