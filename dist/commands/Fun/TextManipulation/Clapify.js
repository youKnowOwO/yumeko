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
const decorators_1 = require("@yumeko/decorators");
let default_1 = class default_1 extends Command_1.default {
    exec(msg, { text }) {
        return msg.ctx.send(`👏${text.replace(/ +/g, "👏")}👏`);
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("clapify", {
        aliases: ["clapify"],
        description: {
            content: (msg) => msg.ctx.lang("COMMAND_TEXT_MANIPULATION_CLAPIFY_DESCRIPTION"),
            usage: "clapify <text>",
            examples: ["clapify good boy"]
        },
        category: "fun",
        args: [
            {
                identifier: "text",
                match: "rest",
                prompt: (msg) => msg.ctx.lang("COMMAND_TEXT_MANIPULATION_PROMPT"),
                type: "string"
            }
        ]
    })
], default_1);
exports.default = default_1;
