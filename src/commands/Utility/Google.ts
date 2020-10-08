import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { load } from "cheerio";
import { stripIndents } from "common-tags";
import { chunk } from "@yumeko/util/Util";
import Pagination from "@yumeko/util/Pagination";

interface Result {
    title: string;
    link: string;
    snippet: string;
}

export default class extends Command {
    public constructor (client: YumekoClient) {
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

    public async exec(msg: Message, { query }: { query: string }): Promise<Message|void> {
        const results = await this.getResults(query, (msg.channel as TextChannel).nsfw);
        const pages = chunk(results.map(x => stripIndents`
            [${x.title}](${x.link})
            ${x.snippet}
        `), 4).map(x => x.join("\n\n"));
        if (!results.length) return msg.ctx.send("🚫 **| No result**");
        const embed = new MessageEmbed()
            .setColor("#E1FAFF")
            .setAuthor(`Result for ${query}`, "http://i.imgur.com/b7k7puJ.jpg");
        await new Pagination(msg, {
            pages, embed,
            edit: (index, emb, page): MessageEmbed => emb.setDescription(page)
                .setFooter(`Page ${index+1} of ${pages.length}`)
        }).start();
    }

    public async getResults(q: string, nsfw: boolean): Promise<Result[]> {
        const { text } = await request.get("https://google.com/search").query(nsfw ? { q } : { q, safe: "strict" })
            .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0");
        const $ = load(text);
        return $("div.rc").map((i, x) => ({
            title: $(x).find("a > h3").text(),
            link: $(x).find("a").attr("href"),
            snippet: $(x).find("div > span").text()
        })).get();
    }
}