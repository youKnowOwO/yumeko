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
const faces = ["(・`ω´・)", ";;w;;", "owo", "UwU", ">w<", "^w^"];
let default_1 = class default_1 extends Command_1.default {
    exec(msg, { text }) {
        text = text.replace(/(?:r|l)/g, "w")
            .replace(/(?:R|L)/g, "W")
            .replace(/n([aeiou])/g, "ny$1")
            .replace(/N([aeiou])/g, "Ny$1")
            .replace(/N([AEIOU])/g, "NY$1")
            .replace(/ove/g, "uv")
            .replace(/!+/g, ` ${faces[Math.floor(Math.random() * faces.length)]} `)
            .trim();
        return msg.ctx.send(text);
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("owoify", {
        aliases: ["owoify"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_TEXT_MANIPULATION_OWOIFY_DESCRIPTION"),
            usage: "owoify <text>",
            examples: ["owoify good boy"]
        },
        category: "fun",
        args: [
            {
                identifier: "text",
                match: "rest",
                prompt: (msg) => msg.guild.loc.get("COMMAND_TEXT_MANIPULATION_PROMPT"),
                type: "string"
            }
        ]
    })
], default_1);
exports.default = default_1;
