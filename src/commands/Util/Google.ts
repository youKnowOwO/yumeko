import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import request from "node-superfetch";
import { Message, MessageEmbed } from "discord.js";
import { load } from "cheerio";
import { stripIndents } from "common-tags";
import { chunk } from "../../util/Util";
import Pagination from "../../util/Pagination";

interface Result {
    title: string;
    link: string;
    snippet: string;
}

export default class GoogleCommand extends Command {
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
                client: ["EMBED_LINKS"]
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
        const input = encodeURIComponent(query.replace(/ +/g, "+"));
        const results = await this.getResults(input);
        const pages = chunk(results.map(x => stripIndents`
            [${x.title}](${x.link})
            ${x.snippet}\n\n
        `), 4).map(x => x.join("\n"));
        if(!results.length) return msg.ctx.send("🚫 **| No result**");
        const embed = new MessageEmbed()
            .setColor("#E1FAFF")
            .setAuthor(`Result for ${query}`, "http://i.imgur.com/b7k7puJ.jpg", `https//www.google.com/search?q=${input}`);
        await new Pagination(msg, {
            pages, embed,
            edit: (index, emb, page): MessageEmbed => emb.setDescription(page[index])
                .setFooter(`Page ${index+1} of ${pages.length}`)
        }).start();
    }

    public async getResults(q: string): Promise<Result[]> {
        const { text } = await request.get("https://google.com").query({ q })
            .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0");
        const $ = load(text);
        return $("div.rc").map((i, x) => ({
            title: $(x).find("div.r > a > h3").text(),
            link: $(x).find("div.rc > div.r > a").attr("href"),
            snippet: $(x).find("div.rc > div.s > div > span").text()
        })).get();
    }
}