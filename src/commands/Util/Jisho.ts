import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import { Message, MessageEmbed } from "discord.js";
import { load } from "cheerio";
import { stripIndents } from "common-tags";

export default class extends Command {
    public constructor (client: YumekoClient) {
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

    public async exec(msg: Message, { word }: { word: string }): Promise<Message|void> {
        const definition = await this.getDefinition(word);
        if (!definition) return msg.ctx.send("🚫 No result found");
        const embed = new MessageEmbed()
            .setColor("#47DB27")
            .setAuthor(definition.form, "https://assets.jisho.org/assets/touch-icon-017b99ca4bfd11363a97f66cc4c00b1667613a05e38d08d858aa5e2a35dce055.png")
            .setDescription(stripIndents`
                Tags: ${definition.tags.length ? definition.tags.map((x: string) => `\`${x}\``).join(" ") : "None"}
                Forms: **${definition.otherforms.length ? definition.otherforms.join(", ") : "None"}**
                ${definition.senses.map((x: any) => `${x.name}: **${x.value}**`).join("\n")}
            `);
        if (definition.kanjis.length) embed.addField("Kanjis", definition.kanjis.map((x: any) => stripIndents`
            > Kanji: **${x.kanji}**
            > Means: **${x.definition}**
            > Kun: **${x.kun.length ? x.kun.join(", ") : "..."}**
            > On: **${x.on.length ? x.on.join(", ") : "..."}**
        `).join("\n\n"));
        if (definition.audio) {
            const { raw: attachment } = await request.get(`https:${definition.audio}`);
            embed.attachFiles([{ attachment, name: "pronounce.mp3" }]);
        }
        msg.ctx.send(embed);
    }

    public async getDefinition(keyword: string): Promise<any> {
        const { body }: any = await request.get("http://jisho.org/api/v1/search/words").query({ keyword });
        const word = body.data[0];
        if (!word) return undefined;
        const $ = load(await request.get(`https://jisho.org/word/${word.slug}`).then(x => x.text));
        let tags: string[] = [];
        if (word.is_common) tags.push("common_word");
        tags = [...word.jlpt, ...word.tags];
        const [form, ...otherforms] = word.japanese.map((x: any) => x.word ? `${x.word}${x.reading ? `【${x.reading}】` : ""}` : x.reading);
        const senses = word.senses.map((x: any) => ({
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