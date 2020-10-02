"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const discord_js_1 = require("discord.js");
const cheerio_1 = require("cheerio");
const common_tags_1 = require("common-tags");
const Util_1 = require("@yumeko/util/Util");
const Pagination_1 = __importDefault(require("@yumeko/util/Pagination"));
class default_1 extends Command_1.default {
    constructor(client) {
        super(client, "google", {
            aliases: ["google", "g"],
            description: {
                content: "Search something on google",
                usage: "google <query>",
                examples: ["google how to bake a cake"]
            },
            category: "utility",
            permissions: {
                client: ["EMBED_LINKS", "ADD_REACTIONS"]
            },
            args: [
                {
                    identifier: "query",
                    match: "rest",
                    prompt: "What query do you want to search ?",
                    type: "string"
                }
            ]
        });
    }
    async exec(msg, { query }) {
        const results = await this.getResults(query, msg.channel.nsfw);
        const pages = Util_1.chunk(results.map(x => common_tags_1.stripIndents `
            [${x.title}](${x.link})
            ${x.snippet}
        `), 4).map(x => x.join("\n\n"));
        if (!results.length)
            return msg.ctx.send("🚫 **| No result**");
        const embed = new discord_js_1.MessageEmbed()
            .setColor("#E1FAFF")
            .setAuthor(`Result for ${query}`, "http://i.imgur.com/b7k7puJ.jpg");
        await new Pagination_1.default(msg, {
            pages, embed,
            edit: (index, emb, page) => emb.setDescription(page)
                .setFooter(`Page ${index + 1} of ${pages.length}`)
        }).start();
    }
    async getResults(q, nsfw) {
        const { text } = await node_superfetch_1.default.get("https://google.com/search").query(nsfw ? { q } : { q, safe: "strict" })
            .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0");
        const $ = cheerio_1.load(text);
        return $("div.rc").map((i, x) => ({
            title: $(x).find("a > h3").text(),
            link: $(x).find("a").attr("href"),
            snippet: $(x).find("div > span").text()
        })).get();
    }
}
exports.default = default_1;
