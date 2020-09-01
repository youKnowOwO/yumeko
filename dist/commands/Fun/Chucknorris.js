"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class ChucknorrisCommand extends Command_1.default {
    constructor(client) {
        super(client, "chucknorris", {
            aliases: ["chucknorris"],
            description: {
                content: (msg) => msg.guild.loc.get("COMMAND_CHUCKNORRIS_DESCRIPTION"),
                usage: "chucknorris",
                examples: ["chucknorris"]
            },
            category: "fun"
        });
    }
    async exec(msg) {
        const { body } = await node_superfetch_1.default.get("https://api.icndb.com/jokes/random");
        return msg.ctx.send(`📢 **| ${body.value.joke}**`);
    }
}
exports.default = ChucknorrisCommand;
