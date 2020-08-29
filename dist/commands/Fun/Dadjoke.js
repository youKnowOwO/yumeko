"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class DadjokeCommand extends Command_1.default {
    constructor(client) {
        super(client, "dadjoke", {
            aliases: ["dadjoke"],
            description: {
                content: "Get random dad joke",
                usage: "dadjoke",
                examples: ["dadjoke"]
            },
            category: "fun"
        });
    }
    async exec(msg) {
        const { body } = await node_superfetch_1.default.get("https://icanhazdadjoke.com/")
            .set("Accept", "application/json");
        return msg.ctx.send(`📢 **| ${body.joke.length ? body.joke : "Try Again"}**`);
    }
}
exports.default = DadjokeCommand;
