"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const Pagination_1 = __importDefault(require("@yumeko/util/Pagination"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const discord_js_1 = require("discord.js");
const Util_1 = require("@yumeko/util/Util");
class default_1 extends Command_1.default {
    constructor(client) {
        super(client, "stackoverflow", {
            aliases: ["stackoverflow", "stckflow"],
            description: {
                content: "Find Answer on Stackoverflow",
                usage: "stackoverflow <query> | [--show <id>]",
                examples: ["stackoverflow discord.js"]
            },
            category: "utility",
            permissions: {
                client: ["EMBED_LINKS", "ADD_REACTIONS"]
            },
            args: [
                {
                    identifier: "isShow",
                    match: "flag",
                    flag: "show"
                },
                {
                    identifier: "query",
                    match: "rest",
                    prompt: "What query do you want to search ?",
                    type: "string"
                }
            ]
        });
    }
    async exec(msg, { query, isShow }) {
        if (isShow) {
            const command = this.collector.commands.get("stackoverflow-show");
            msg.args = [...msg.args, ...query.split(/ +/g)];
            this.collector.runner.runCommand(msg, command);
            return undefined;
        }
        const { body } = await node_superfetch_1.default.get("http://api.stackexchange.com/2.2/search/advanced")
            .query({
            order: "asc",
            sort: "relevance",
            q: encodeURIComponent(query),
            site: "stackoverflow"
        });
        if (!body.items || !body.items.length)
            return msg.ctx.send("🚫 No result found");
        const pages = Util_1.chunk(body.items.map(((x, i) => `\`${i + 1}.\` **{[${x.question_id}](${x.link})} ${x.title}**`)), 10)
            .map(x => x.join("\n"));
        const embed = new discord_js_1.MessageEmbed()
            .setColor("#F48023")
            .setAuthor("Search Result", "https://i.imgur.com/P2jAgE3.png");
        await new Pagination_1.default(msg, {
            pages, embed,
            edit: (index, embd, page) => embd.setDescription(page).setFooter(`Page ${index + 1} of ${pages.length}`)
        }).start();
    }
}
exports.default = default_1;
