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
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
const CodeLinter_1 = require("@yumeko/util/CodeLinter");
let EslintRule = class EslintRule extends Command_1.default {
    exec(msg, { query }) {
        query = query.toLowerCase();
        const rule = CodeLinter_1.getRule(query);
        if (!rule || !rule.meta)
            return msg.ctx.send("🚫 No result found");
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor("ESLint", "https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/358/full/eslintlogo.png", "https://eslint.org/")
            .setColor("#3A33D1")
            .setURL(rule.meta.docs.url)
            .setTitle(`${query} (${rule.meta.docs.category}) ${rule.meta.docs.recommended ? "[RECOMMENDED]" : ""}`)
            .setDescription(rule.meta.docs.description);
        if (rule.meta.messages) {
            const messages = Object.keys(rule.meta.messages)
                .map(x => `• **${x}:** ${rule.meta.messages[x]}`)
                .join("\n");
            embed.addField("Messages", messages);
        }
        return msg.ctx.send(embed);
    }
};
EslintRule = __decorate([
    decorators_1.DeclareCommand("eslint-rule", {
        aliases: ["eslint-rule", "lint-rule"],
        description: {
            content: "Get information on an eslint rule",
            usage: "eslint-rule <query>",
            examples: ["eslint-rule no-eval"]
        },
        category: "utility",
        permissions: {
            client: ["EMBED_LINKS"]
        },
        args: [
            {
                identifier: "query",
                match: "rest",
                type: "string",
                prompt: "What rule do you want to see ?"
            }
        ]
    })
], EslintRule);
exports.default = EslintRule;
