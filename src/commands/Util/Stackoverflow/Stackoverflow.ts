import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import Pagination from "../../../util/Pagination";
import request from "node-superfetch";
import { Message, MessageEmbed } from "discord.js";
import { chunk } from "../../../util/Util";

export default class StackoverflowCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "stackoverflow", {
            aliases: ["stackoverflow", "stckflow"],
            description: {
                content: "Find Answer on Stackoverflow",
                usage: "stackoverflow <query> | [--show <id>]",
                examples: ["stackoverflow discord.js"]
            },
            category: "utility",
            permissions: {
                client: ["EMBED_LINKS"]
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

    public async exec(msg: Message, { query, isShow }: { query: string; isShow: boolean }): Promise<Message|void> {
        if (isShow) {
            const command = this.collector!.commands.get("stackoverflow-show")!;
            msg.args = [...msg.args, ...query.split(/ +/g)];
            this.collector!.runner.runCommand(msg, command);
            return undefined;
        }
        const { body }: any = await request.get("http://api.stackexchange.com/2.2/search/advanced")
            .query({
                order: "asc",
                sort: "relevance",
                q: encodeURIComponent(query),
                site: "stackoverflow"
            });
        if (!body.items || !body.items.length) return msg.ctx.send("🚫 No result found");
        const pages = chunk(body.items.map(((x: any, i: number) => `\`${i+1}.\` **{[${x.question_id}](${x.link})} ${x.title}**`)), 10)
            .map(x => x.join("\n"));
        const embed = new MessageEmbed()
            .setColor("#F48023")
            .setAuthor("Search Result", "https://i.imgur.com/P2jAgE3.png");
        await new Pagination(msg, {
            pages, embed,
            edit: (index, embd, page): MessageEmbed => embd.setDescription(page).setFooter(`Page ${index+1} of ${pages.length}`)
        }).start();
    }
}