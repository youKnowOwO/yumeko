"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const Pagination_1 = __importDefault(require("@yumeko/util/Pagination"));
const turndown_1 = __importDefault(require("turndown"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const discord_js_1 = require("discord.js");
const Util_1 = require("@yumeko/util/Util");
const cheerio_1 = require("cheerio");
class default_1 extends Command_1.default {
    constructor(client) {
        super(client, "stackoverflow-show", {
            aliases: [],
            description: {
                content: "Show question and answer from Stackoverflow",
                usage: "<id>",
                examples: []
            },
            category: "utility",
            permissions: {
                client: ["EMBED_LINKS", "ADD_REACTIONS"]
            },
            args: [
                {
                    identifier: "id",
                    match: "rest",
                    prompt: "What ID do you want to show ?",
                    type: "number"
                }
            ]
        });
    }
    async exec(msg, { id }) {
        const page = await this.fetchID(id);
        if (!page)
            return msg.ctx.send("🚫 No Question Found");
        const $ = cheerio_1.load(page);
        const td = new turndown_1.default()
            .addRule("aside", {
            filter: "aside",
            replacement: text => text.split(/\n+/g).map(x => `> ${x}`).join("\n")
        })
            .addRule("codeblock", {
            filter: "pre",
            replacement: text => Util_1.codeBlock("", text)
        });
        const [question, ...pages] = $("div.post-text")
            .map((_, x) => $(x).html()).get()
            .map(x => Util_1.decodeHTMLEntities(td.turndown(x)));
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor("Stackoverflow", "https://i.imgur.com/P2jAgE3.png")
            .setTitle("QUESTION")
            .setColor("#F48023")
            .setDescription(question.length > 2048 ? `Please visit the real [site](https://stackoverflow.com/questions/${id}). This question is too long to load` : question);
        await msg.channel.send(embed);
        embed.author = null;
        embed.setTitle("ANSWERS");
        await new Pagination_1.default(msg, {
            pages, embed,
            edit: (index, embd, page) => embd.setDescription(page.length > 2048 ? `Please visit the real [site](https://stackoverflow.com/questions/${id}). This answer is too long to load` : page).setFooter(`Page ${index + 1} of ${pages.length}`)
        }).start();
    }
    async fetchID(id) {
        try {
            return await node_superfetch_1.default.get(`https://stackoverflow.com/questions/${id}`).then(x => x.text);
        }
        catch {
            return undefined;
        }
    }
}
exports.default = default_1;
