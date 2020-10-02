"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const figlet_1 = __importDefault(require("figlet"));
const util_1 = require("util");
const Util_1 = require("@yumeko/util/Util");
const decorators_1 = require("@yumeko/decorators");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg, { text }) {
        const ascii = await util_1.promisify(figlet_1.default)(text);
        return msg.ctx.send(Util_1.codeBlock("ascci", ascii));
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("asciify", {
        aliases: ["asciify", "ascii"],
        description: {
            content: (msg) => msg.ctx.lang("COMMAND_TEXT_MANIPULATION_ASCII_DESCRIPTION"),
            usage: "asciify <text>",
            examples: ["ascii yo"]
        },
        category: "fun",
        args: [
            {
                identifier: "text",
                match: "rest",
                prompt: (msg) => msg.ctx.lang("COMMAND_TEXT_MANIPULATION_PROMPT"),
                type: (_, content) => {
                    if (content.length > 14)
                        throw new CustomError_1.default("!PARSING", "**Only \`14\` characters are allowed**");
                    return content;
                }
            }
        ]
    })
], default_1);
exports.default = default_1;
