import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import Pagination from "../../../util/Pagination";
import TurndownService from "turndown";
import request from "node-superfetch";
import { Message, MessageEmbed } from "discord.js";
import { decodeHTMLEntities, codeBlock } from "../../../util/Util";
import { load } from "cheerio";

export default class StackoverflowShowCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "stackoverflow-show", {
            aliases: [],
            description: {
                content: "Show question and answer from Stackoverflow",
                usage: "<id>",
                examples: []
            },
            category: "utility",
            permissions: {
                client: ["EMBED_LINKS"]
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

    public async exec(msg: Message, { id }: { id: number }): Promise<Message|void> {
        const page = await this.fetchID(id);
        if(!page) return msg.ctx.send("🚫 No Question Found");
        const $ = load(page);
        const td = new TurndownService()
            .addRule("aside", {
                filter: "aside",
                replacement: text => text.split(/\n+/g).map(x => `> ${x}`).join("\n")
            })
            .addRule("codeblock", {
                filter: "pre",
                replacement: text => codeBlock("", text)
            });
        const [question, ...pages] = $("div.post-text")
            .map((_, x) => $(x).html()).get()
            .map(x => decodeHTMLEntities(td.turndown(x)));
        const embed = new MessageEmbed()
            .setAuthor("Stackoverflow", "https://i.imgur.com/P2jAgE3.png")
            .setTitle("QUESTION")
            .setColor("#F48023")
            .setDescription(question.length > 2048 ? `Please visit the real [site](https://stackoverflow.com/questions/${id}). This question is too long to load` : question);
        await msg.channel.send(embed);
        embed.author = null;
        embed.setTitle("ANSWERS");
        await new Pagination(msg, {
            pages, embed,
            edit: (index, embd, page): MessageEmbed => embd.setDescription(page.length > 2048 ? `Please visit the real [site](https://stackoverflow.com/questions/${id}). This answer is too long to load` : page).setFooter(`Page ${index+1} of ${pages.length}`)
        }).start();
    }

    public async fetchID(id: number): Promise<any> {
        try {
            return await request.get(`https://stackoverflow.com/questions/${id}`).then(x => x.text);
        } catch {
            return undefined;
        }
    }
}