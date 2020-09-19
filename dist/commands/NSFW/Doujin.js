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
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const moment_1 = __importDefault(require("moment"));
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
const common_tags_1 = require("common-tags");
const Util_1 = require("@yumeko/util/Util");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg, { query }) {
        const doujins = await this.getDoujin(query);
        if (!doujins.length)
            return msg.ctx.send("🚫 No result found");
        return this.handleDoujinSelect(msg, doujins);
    }
    async getDoujin(query) {
        const doujins = [];
        const isById = !isNaN(Number(query));
        const { body } = await node_superfetch_1.default.get(`https://nhentai.net/api/${isById ? "gallery/" : "galleries/search?query="}${query}`);
        doujins.push(...(isById ? [body] : body.result));
        for (const doujin of doujins)
            this.assignURL(doujin);
        return doujins;
    }
    async handleRead(msg, doujin) {
        let index = 0;
        const embed = new discord_js_1.MessageEmbed()
            .setColor(0x1F1F1F)
            .setURL(`https://nhentai.net/g/${doujin.id}`)
            .setAuthor(doujin.title.english, "https://i.imgur.com/uLAimaY.png")
            .setTitle(doujin.title.japanese)
            .setImage(`https://i.nhentai.net${doujin.images.pages[index].u}`)
            .setFooter(`Page ${index + 1} of ${doujin.num_pages} / ${doujin.id}`);
        const message = await msg.channel.send(embed);
        const emojis = ["⏪", "⬅️", "🚫", "➡️", "⏩"];
        for (const emoji of emojis)
            await message.react(emoji);
        return new Promise(resolve => {
            const filter = (react, usr) => emojis.includes(react.emoji.name) && usr.id === msg.author.id;
            const collector = message.createReactionCollector(filter)
                .on("collect", col => {
                if (col.emoji.name === "🚫") {
                    collector.stop();
                    return resolve(msg);
                }
                index += [-10, -1, 0, 1, 10][emojis.indexOf(col.emoji.name)];
                index = ((index % doujin.num_pages) + doujin.num_pages) % doujin.num_pages;
                embed.setImage(`https://i.nhentai.net${doujin.images.pages[index].u}`).setFooter(`Page ${index + 1} of ${doujin.num_pages} / ${doujin.id}`);
                message.edit(embed);
            });
        });
    }
    async handleDoujinSelect(msg, doujins) {
        let index = 0;
        const embedDoujin = (doujin) => {
            const tags = [];
            const desc = {};
            for (const tag of doujin.tags) {
                if (tag.type === "tag")
                    tags.push(`[${tag.name}](https://nhentai.net${tag.url})`);
                else {
                    if (!desc[tag.type])
                        desc[tag.type] = [];
                    desc[tag.type].push(`[${tag.name}](https://nhentai.net${tag.url})`);
                }
            }
            const embed = new discord_js_1.MessageEmbed()
                .setColor(0x1F1F1F)
                .setURL(`https://nhentai.net/g/${doujin.id}`)
                .setAuthor(doujin.title.english, "https://i.imgur.com/uLAimaY.png")
                .setTitle(doujin.title.japanese)
                .setDescription(common_tags_1.stripIndents `
                    ${Object.keys(desc).map(x => `${Util_1.firstUpperCase(x)}: ${desc[x].join(", ")}`).join("\n")}
                    Pages: \`${doujin.num_pages}\`
                    Favorites: \`${doujin.num_favorites}\`
                    Created: \`${moment_1.default(Date.now() - doujin.upload_date).format("MMMM Do YYYY, h:mm:ss a")}\`
                `)
                .setImage(`https://t.nhentai.net${doujin.images.cover.u}`);
            if (tags.length)
                embed.addField("Tags", tags.join(", "));
            return embed;
        };
        const list = Util_1.chunk(doujins.map((x, i) => `\`${i + 1}.\` **${x.title.english}**`), 10).map(x => x.join("\n"));
        const embed = new discord_js_1.MessageEmbed()
            .setColor(0x1F1F1F)
            .setAuthor("Search Result", "https://i.imgur.com/uLAimaY.png")
            .setDescription(list[index])
            .setFooter(`Page ${index + 1} / ${list.length} • if you wannt to see detail of the doujin just type the number`);
        let selectedDoujin;
        if (doujins.length < 2)
            selectedDoujin = doujins[0];
        const message = await msg.channel.send(selectedDoujin ? embedDoujin(selectedDoujin) : embed);
        const emojis = ["⏪", "⬅️", "➡️", "⏩"];
        await message.react("🚫");
        if (list.length > 1)
            for (const emoji of emojis)
                await message.react(emoji);
        if (selectedDoujin)
            await message.react("📖");
        return new Promise(resolve => {
            const reactionCollectorFilter = (react, usr) => (["🚫", ...(selectedDoujin ? ["📖", "🔙"] : emojis)].includes(react.emoji.name)) && usr.id === msg.author.id;
            const messageCollectorFilter = (mess) => !selectedDoujin && !isNaN(Number(mess.content)) && msg.author.id === mess.author.id;
            const messageCollector = msg.channel.createMessageCollector(messageCollectorFilter)
                .on("collect", col => {
                const num = parseInt(col.content);
                if (num < 1 && num > doujins.length)
                    return undefined;
                selectedDoujin = doujins[num - 1];
                message.edit(embedDoujin(selectedDoujin));
                message.react("📖").then(() => message.react("🔙"));
            });
            const reactionCollector = message.createReactionCollector(reactionCollectorFilter)
                .on("collect", col => {
                if (col.emoji.name === "🚫") {
                    messageCollector.stop();
                    reactionCollector.stop();
                    return resolve(msg);
                }
                else if (col.emoji.name === "📖") {
                    messageCollector.stop();
                    reactionCollector.stop();
                    message.delete();
                    return resolve(this.handleRead(msg, selectedDoujin));
                }
                else if (col.emoji.name === "🔙") {
                    if (doujins.length < 2)
                        return undefined;
                    selectedDoujin = undefined;
                    embed.setDescription(list[index]).setFooter(`Page ${index + 1} / ${list.length} • if you wannt to see detail of the doujin just type the number`);
                    message.edit(embed);
                }
                else {
                    if (!list.length)
                        return undefined;
                    index += [-10, -1, 1, 10][emojis.indexOf(col.emoji.name)];
                    index = ((index % list.length) + list.length) % list.length;
                    embed.setDescription(list[index]).setFooter(`Page ${index + 1} / ${list.length} • if you wannt to see detail of the doujin just type the number`);
                    message.edit(embed);
                }
            });
        });
    }
    assignURL(doujin) {
        const { pages, thumbnail, cover } = doujin.images;
        const typeImage = (data) => data.t === "j" ? "jpg" : "png";
        thumbnail.u = `/galleries/${doujin.media_id}/thumb.${typeImage(thumbnail)}`;
        cover.u = `/galleries/${doujin.media_id}/cover.${typeImage(cover)}`;
        for (let i = 0; i < pages.length; i++)
            pages[i].u = `/galleries/${doujin.media_id}/${i + 1}.${typeImage(pages[i])}`;
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("doujin", {
        aliases: ["doujin", "nhentai", "nh"],
        description: {
            content: "Search & read some doujin from nhentai",
            usage: "doujin query",
            examples: ["doujin yoshida saki", "doujin 289015"]
        },
        category: "nsfw",
        nsfw: true,
        args: [
            {
                identifier: "query",
                match: "rest",
                type: "string",
                prompt: "What Query or book id do you want to search ?"
            }
        ]
    })
], default_1);
exports.default = default_1;
