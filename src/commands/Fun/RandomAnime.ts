import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import { Message, MessageEmbed } from "discord.js";
import { DeclareCommand } from "@yumeko/decorators";
import { stripIndents } from "common-tags";

interface RandomAnimeResponse {
    name: string;
    alternate_name: string;
    image: string;
    description: string;
    genres: string[];
    avg_score: string;
    episodes: string;
    eps_duration: string;
    release_date: string;
    season: string;
    rating: string;
    source: string;
    watch: {[key: string]: PlatformWatch[]};
}

interface PlatformWatch {
    platform: string;
    url: string;
}

@DeclareCommand("random-anime", {
    aliases: ["random-anime"],
    description: {
        content: "Completely show you random anime",
        usage: "random-anime",
        examples: ["rabdom-anime"]
    },
    category: "fun"
})
export default class extends Command {
    public async exec(msg: Message): Promise<Message> {
        const response = await request.get("https://emilia-api.xyz/api/random-anime")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`);
        const body = response.body as RandomAnimeResponse;
        const embed = new MessageEmbed()
            .setTitle(body.name)
            .setColor(this.client.config.color)
            .setDescription(`> ${body.description}`)
            .setImage(body.image)
            .addField("\u200B", stripIndents`
                Score: **${body.avg_score}**
                Episodes: **${body.episodes}**
                Duration: **${body.eps_duration}**
                Release: **${body.release_date}**
                Season: **${body.season}**
                Rating: **${body.rating}**
                Source: **${body.source}**
                Genres: ${body.genres.map(x => `\`${x}\``).join(", ")}
            `);
        if (body.alternate_name.length) embed.setTitle(body.alternate_name).setAuthor(body.name);
        const watchs: string[] = [];
        for (const key of Object.keys(body.watch)) {
            const platforms = body.watch[key].map(x => `[${x.platform}](${x.url})`).join(", ");
            watchs.push(`${key.toUpperCase()}: ${platforms}`);
        }
        embed.addField("Watch !", watchs.join("\n"));
        return msg.ctx.send(embed);
    }
}