import Command from "../../classes/Command";
import request from "node-superfetch";
import moment from "moment";
import { Message, MessageEmbed, MessageReaction, User, Collector } from "discord.js";
import { DeclareCommand } from "../../decorators";
import { stripIndents } from "common-tags";
import { firstUpperCase, chunk } from "../../util/Util";

interface ImageDetail {
    u: string;
    t: string;
    w: number;
    h: number;
}
interface DoujinResponse {
    id: string | number;
    media_id: string;
    title: {
        english: string;
        japanese: string;
        pretty: string;
    };
    images: {
        pages: ImageDetail[];
        cover:ImageDetail;
        thumbnail: ImageDetail;
    };
    scanlator: string;
    upload_date: number;
    tags: {
	    id: number;
        type: string;
        name: string;
        url: string;
        count: number;
    }[];
    num_pages: number;
    num_favorites: number;
}

@DeclareCommand("doujin", {
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
export default class DoujinCommand extends Command {
    public async exec(msg: Message, { query }: { query: string }): Promise<Message> {
        const doujins = await this.getDoujin(query);
        if (!doujins.length) return msg.ctx.send("🚫 No result found");
        return this.handleDoujinSelect(msg, doujins);
    }

    public async getDoujin(query: string): Promise<DoujinResponse[]> {
        const doujins: DoujinResponse[] = [];
        const isById = !isNaN(Number(query));
        const { body }: any = await request.get(`https://nhentai.net/api/${isById ? "gallery/" : "galleries/search?query="}${query}`);
        doujins.push(...(isById ? [body] : body.result));
        for (const doujin of doujins) this.assignURL(doujin);
        return doujins;
    }

    private assignURL(doujin: DoujinResponse): void {
        const { pages, thumbnail, cover } = doujin.images;
        const typeImage = (data: ImageDetail): string => data.t === "j" ? "jpg" : "png";
        thumbnail.u = `/galleries/${doujin.media_id}/thumb.${typeImage(thumbnail)}`;
        cover.u = `/galleries/${doujin.media_id}/cover.${typeImage(cover)}`;
        for (let i = 0; i < pages.length; i++) pages[i].u = `/galleries/${doujin.media_id}/${i + 1}.${typeImage(pages[i])}`;
    }

    public async handleRead(msg: Message, doujin: DoujinResponse): Promise<Message> {
        let index = 0;
        const embed = new MessageEmbed()
            .setColor(0x1F1F1F)
            .setURL(`https://nhentai.net/g/${doujin.id}`)
            .setAuthor(doujin.title.english, "https://i.imgur.com/uLAimaY.png")
            .setTitle(doujin.title.japanese)
            .setImage(`https://i.nhentai.net${doujin.images.pages[index].u}`)
            .setFooter(`Page ${index + 1} of ${doujin.num_pages} / ${doujin.id}`);
        const message = await msg.channel.send(embed);
        const emojis = ["⏪", "⬅️", "🚫", "➡️", "⏩"];
        for (const emoji of emojis) await message.react(emoji);
        return new Promise(resolve => {
            const filter = (react: MessageReaction, usr: User): boolean => emojis.includes(react.emoji.name) && usr.id === msg.author.id;
            const collector = message.createReactionCollector(filter)
                .on("collect", col => {
                    if (col.emoji.name === "🚫") {
                        (collector as Collector<string, MessageReaction>).stop();
                        return resolve(msg);
                    }
                    index += [-10, -1, 0, 1, 10][emojis.indexOf(col.emoji.name)];
                    index = ((index % doujin.num_pages) + doujin.num_pages) % doujin.num_pages;
                    embed.setImage(`https://i.nhentai.net${doujin.images.pages[index].u}`).setFooter(`Page ${index + 1} of ${doujin.num_pages} / ${doujin.id}`);
                    message.edit(embed);
                });
        });
    }

    public async handleDoujinSelect(msg: Message, doujins: DoujinResponse[]): Promise<Message> {
        let index = 0;
        const embedDoujin = (doujin: DoujinResponse): MessageEmbed => {
            const tags: string[] = [];
            const desc: {[key: string]: string[]} = {};
            for (const tag of doujin.tags) {
                if (tag.type === "tag") tags.push(`[${tag.name}](https://nhentai.net${tag.url})`);
                else {
                    if (!desc[tag.type]) desc[tag.type] = [];
                    desc[tag.type].push(`[${tag.name}](https://nhentai.net${tag.url})`);
                }
            }
            const embed = new MessageEmbed()
                .setColor(0x1F1F1F)
                .setURL(`https://nhentai.net/g/${doujin.id}`)
                .setAuthor(doujin.title.english, "https://i.imgur.com/uLAimaY.png")
                .setTitle(doujin.title.japanese)
                .setDescription(stripIndents`
                    ${Object.keys(desc).map(x => `${firstUpperCase(x)}: ${desc[x].join(", ")}`).join("\n")}
                    Pages: \`${doujin.num_pages}\`
                    Favorites: \`${doujin.num_favorites}\`
                    Created: \`${moment(Date.now() - doujin.upload_date).format("MMMM Do YYYY, h:mm:ss a")}\`
                `)
                .setImage(`https://t.nhentai.net${doujin.images.cover.u}`);
            if (tags.length) embed.addField("Tags", tags.join(", "));
            return embed;
        };
        const list = chunk(doujins.map((x, i) => `\`${i + 1}.\` **${x.title.english}**`), 10).map(x => x.join("\n"));
        const embed = new MessageEmbed()
            .setColor(0x1F1F1F)
            .setAuthor("Search Result", "https://i.imgur.com/uLAimaY.png")
            .setDescription(list[index])
            .setFooter(`Page ${index + 1} / ${list.length} • if you wannt to see detail of the doujin just type the number`);
        let selectedDoujin: DoujinResponse | undefined;
        if (doujins.length < 2) selectedDoujin = doujins[0];
        const message = await msg.channel.send(selectedDoujin ? embedDoujin(selectedDoujin) : embed);
        const emojis = ["⏪", "⬅️", "➡️", "⏩"];
        await message.react("🚫");
        if (list.length > 1) for (const emoji of emojis) await message.react(emoji);
        if (selectedDoujin) await message.react("📖");
        return new Promise(resolve => {
            const reactionCollectorFilter = (react: MessageReaction, usr: User): boolean => (["🚫", ...(selectedDoujin ? ["📖", "🔙"] : emojis)].includes(react.emoji.name)) && usr.id === msg.author.id;
            const messageCollectorFilter = (mess: Message): boolean => !selectedDoujin && !isNaN(Number(mess.content)) && msg.author.id === mess.author.id;
            const messageCollector = msg.channel.createMessageCollector(messageCollectorFilter)
                .on("collect", col => {
                    const num = parseInt(col.content);
                    if (num < 1 && num > doujins.length) return undefined;
                    selectedDoujin = doujins[num - 1];
                    message.edit(embedDoujin(selectedDoujin));
                    message.react("📖").then(() => message.react("🔙"));
                });
            const reactionCollector = message.createReactionCollector(reactionCollectorFilter)
                .on("collect", col => {
                    if (col.emoji.name === "🚫") {
                        (messageCollector as Collector<string, Message>).stop();
                        (reactionCollector as Collector<string, MessageReaction>).stop();
                        return resolve(msg);
                    } else if (col.emoji.name === "📖") {
                        (messageCollector as Collector<string, Message>).stop();
                        (reactionCollector as Collector<string, MessageReaction>).stop();
                        message.delete();
                        return resolve(this.handleRead(msg, selectedDoujin!));
                    } else if (col.emoji.name === "🔙") {
                        if (doujins.length < 2) return undefined;
                        selectedDoujin = undefined;
                        embed.setDescription(list[index]).setFooter(`Page ${index + 1} / ${list.length} • if you wannt to see detail of the doujin just type the number`);
                        message.edit(embed);
                    } else {
                        if (!list.length) return undefined;
                        index += [-10, -1, 1, 10][emojis.indexOf(col.emoji.name)];
                        index = ((index % list.length) + list.length) % list.length;
                        embed.setDescription(list[index]).setFooter(`Page ${index + 1} / ${list.length} • if you wannt to see detail of the doujin just type the number`);
                        message.edit(embed);
                    }
                });
        });
    }
}