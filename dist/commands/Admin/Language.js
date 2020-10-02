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
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const common_tags_1 = require("common-tags");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg, { language }) {
        if (language) {
            msg.guild.loc.lang = language;
            if (msg.prefix)
                await msg.guild.updateDatabase();
            const currentLang = [
                msg.ctx.lang("META_NAME"),
                msg.ctx.lang("META_EMOJI")
            ];
            return msg.ctx.send(msg.ctx.lang("COMMAND_LANGUAGE_SET", ...currentLang));
        }
        const currentLang = [
            msg.ctx.lang("META_NAME"),
            msg.ctx.lang("META_EMOJI")
        ];
        let index = 0;
        const list = this.client.langs.map((x, i) => common_tags_1.oneLineTrim `
            \`${++index}.\` 
            **${x.META_NAME()}** 
            \`${i}\` 
            ${x.META_EMOJI()}
        `).join("\n");
        return msg.ctx.send(msg.ctx.lang("COMMAND_LANGUAGE_LIST", msg.prefix, list, ...currentLang));
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("language", {
        aliases: ["language", "lang", "setlang", "locale"],
        description: {
            content: (msg) => msg.ctx.lang("COMMAND_LANGUAGE_DESCRIPTION"),
            usage: "language [lang]",
            examples: ["language", "language id_ID", "language 1"]
        },
        category: "admin",
        permissions: {
            user: ["MANAGE_GUILD"]
        },
        args: [
            {
                identifier: "language",
                match: "single",
                type: (msg, content) => {
                    const { langs } = msg.client;
                    let lang;
                    if (!isNaN(Number(content)))
                        lang = langs.keyArray()[Number(content) - 1];
                    else if (langs.has(content))
                        lang = content;
                    if (!lang)
                        throw new CustomError_1.default("!PARSING", msg.ctx.lang("COMMAND_LANGUAGE_NOT_FOUND", content));
                    return lang;
                },
                optional: true
            }
        ]
    })
], default_1);
exports.default = default_1;
