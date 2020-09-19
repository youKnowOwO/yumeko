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
class default_1 extends Command_1.default {
    constructor(client) {
        super(client, "jisho", {
            aliases: ["jisho"],
            description: {
                content: "Defines a word, but with japanese",
                usage: "jisho <word>",
                examples: ["jisho tea"]
            },
            category: "utility",
            permissions: {
                client: ["EMBED_LINKS"]
            },
            args: [
                {
                    identifier: "word",
                    match: "rest",
                    prompt: "What word do you want to lookup ?",
                    type: "string"
                }
            ]
        });
    }
    async exec(msg, { word }) {
        const definition = await this.getDefinition(word);
        if (!definition)
            return msg.ctx.send("🚫 No result found");
        const embed = new discord_js_1.MessageEmbed()
            .setColor("#47DB27")
            .setAuthor(definition.form, "https://assets.jisho.org/assets/touch-icon-017b99ca4bfd11363a97f66cc4c00b1667613a05e38d08d858aa5e2a35dce055.png")
            .setDescription(common_tags_1.stripIndents `
                Tags: ${definition.tags.length ? definition.tags.map((x) => `\`${x}\``).join(" ") : "None"}
                Forms: **${definition.otherforms.length ? definition.otherforms.join(", ") : "None"}**
                ${definition.senses.map((x) => `${x.name}: **${x.value}**`).join("\n")}
            `);
        if (definition.kanjis.length)
            embed.addField("Kanjis", definition.kanjis.map((x) => common_tags_1.stripIndents `
            > Kanji: **${x.kanji}**
            > Means: **${x.definition}**
            > Kun: **${x.kun.length ? x.kun.join(", ") : "..."}**
            > On: **${x.on.length ? x.on.join(", ") : "..."}**
        `).join("\n\n"));
        if (definition.audio) {
            const { raw: attachment } = await node_superfetch_1.default.get(`https:${definition.audio}`);
            embed.attachFiles([{ attachment, name: "pronounce.mp3" }]);
        }
        msg.ctx.send(embed);
    }
    async getDefinition(keyword) {
        const { body } = await node_superfetch_1.default.get("http://jisho.org/api/v1/search/words").query({ keyword });
        const word = body.data[0];
        if (!word)
            return undefined;
        const $ = cheerio_1.load(await node_superfetch_1.default.get(`https://jisho.org/word/${word.slug}`).then(x => x.text));
        let tags = [];
        if (word.is_common)
            tags.push("common_word");
        tags = [...word.jlpt, ...word.tags];
        const [form, ...otherforms] = word.japanese.map((x) => x.word ? `${x.word}${x.reading ? `【${x.reading}】` : ""}` : x.reading);
        const senses = word.senses.map((x) => ({
            name: x.parts_of_speech.join(", "),
            value: x.english_definitions.join(", ")
        }));
        const audio = $("source[type='audio/mpeg']").attr("src");
        const kanjis = $("div.kanji_light_content").map((_, x) => {
            const el = $(x);
            return {
                kanji: el.find("span[class='character literal japanese_gothic']").text(),
                definition: el.find("div[class='meanings english sense']").text().replace(/\n/g, "").split(/ +/g).join(" ").trim(),
                kun: el.find("div[class='kun readings']").find("a").map((_, e) => $(e).text()).get(),
                on: el.find("div[class='on readings']").find("a").map((_, e) => $(e).text()).get()
            };
        }).get();
        return { tags, form, otherforms, senses, audio, kanjis };
    }
}
exports.default = default_1;
