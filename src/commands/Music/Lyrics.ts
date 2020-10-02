import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";
import { chunk } from "@yumeko/util/Util";
import { MessageEmbed } from "discord.js";
import Pagination from "@yumeko/util/Pagination";

interface LyricsResponse {
    title: string;
    author: string;
    lyrics: string;
    thumbnail: {
        genius: string;
    };
    links: {
        genius: string;
    };
}

@DeclareCommand("lyrics", {
    aliases: ["lyrics", "lyrics"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_MUSIC_LYRICS_DESCRIPTION"),
        usage: "lyrics",
        examples: ["lyrics Moo Doja Cat"]
    },
    category: "music",
    args: [
        {
            identifier: "title",
            match: "rest",
            type: "string",
            prompt: "What the title of the song ?"
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { title }: { title: string }): Promise<Message> {
        const result = await this.getLyrics(title);
        if (!result) return msg.ctx.send(msg.ctx.lang("COMMAND_UTIL_NO_RESULT_FOUND"));
        const pages = chunk(result.lyrics, 2048);
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setURL(result.links.genius)
            .setTitle(result.title)
            .setThumbnail(result.thumbnail.genius);
        return new Pagination(msg, {
            embed, pages,
            edit: (index, emb, page): MessageEmbed => emb.setDescription(page).setFooter(`Page ${index + 1} of ${pages.length}`)
        }).start();
    }

    public async getLyrics(title: string): Promise<LyricsResponse|void> {
        const { body }: any = await request.get("https://some-random-api.ml/lyrics")
            .query({ title });
        if (body.error) return undefined;
        return body;
    }
}