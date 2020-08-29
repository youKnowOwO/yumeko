"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const figlet_1 = __importDefault(require("figlet"));
const util_1 = require("util");
const Util_1 = require("@yumeko/util/Util");
class AsciiCommand extends Command_1.default {
    constructor(client) {
        super(client, "asciify", {
            aliases: ["asciify", "ascii"],
            description: {
                content: "Concert text to ASCII",
                usage: "asciify <text>",
                examples: ["ascii yo"]
            },
            category: "fun",
            args: [
                {
                    identifier: "text",
                    match: "rest",
                    prompt: "What text do you want me to convert ?",
                    type: (_, content) => {
                        if (content.length > 14)
                            throw new CustomError_1.default("!PARSING", "**Only \`14\` characters are allowed**");
                        return content;
                    }
                }
            ]
        });
    }
    async exec(msg, { text }) {
        const ascii = await util_1.promisify(figlet_1.default)(text);
        return msg.ctx.send(Util_1.codeBlock("ascci", ascii));
    }
}
exports.default = AsciiCommand;
