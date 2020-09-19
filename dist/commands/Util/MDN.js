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
const turndown_1 = __importDefault(require("turndown"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg, { query }) {
        const result = await this.getResult(query);
        if (!result || !result.url || !result.title || !result.summary)
            return msg.ctx.send(msg.guild.loc.get("COMMAND_UTIL_NO_RESULT_FOUND"));
        const summary = new turndown_1.default()
            .addRule("hyperlink", {
            filter: "a",
            replacement: (text, node) => `[${text}](https://developer.mozilla.org${node.href})`
        })
            .turndown(result.summary.replace(/<code><strong>(.+)<\/strong><\/code>/g, "<strong><code>$1</code></strong>"));
        const embed = new discord_js_1.MessageEmbed()
            .setColor(0x066FAD)
            .setAuthor("MDN", "https://i.imgur.com/DFGXabG.png", "https://developer.mozilla.org/")
            .setURL(`https://developer.mozilla.org${result.url}`)
            .setTitle(result.title)
            .setDescription(summary);
        return msg.ctx.send(embed);
    }
    async getResult(query) {
        const result = await this.search(query.replace(/#/g, ".prototype."));
        if (!result)
            return undefined;
        const { body } = await node_superfetch_1.default.get(`${result}$children?expand`);
        return body;
    }
    async search(query) {
        const { text } = await node_superfetch_1.default.get("https://duckduckgo.com")
            .query("q", `! site:developer.mozilla.org ${query}`);
        const match = text.match(/https%3A%2F%2Fdeveloper\.mozilla\.org%2F.+(?='><\/head>)/g);
        if (!match)
            return undefined;
        return decodeURIComponent(match[0]);
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
__decorate([
    decorators_1.constantly
], default_1.prototype, "getResult", null);
__decorate([
    decorators_1.hide
], default_1.prototype, "search", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("mdn", {
        aliases: ["mdn", "mozilla-developer-network"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_MDN_DESCRIPTION"),
            usage: "mdn <query>",
            examples: ["mdn String"]
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
                prompt: (msg) => msg.guild.loc.get("COMMAND_MDN_PROMPT")
            }
        ]
    })
], default_1);
exports.default = default_1;
