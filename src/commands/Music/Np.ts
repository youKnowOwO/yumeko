import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import { MessageEmbed, Message } from "discord.js";

export default class NpCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "np", {
            aliases: ["np", "nowplay"],
            description: {
                content: "np",
                usage: "np",
                examples: ["np"]
            },
            permissions: {
                client: ["EMBED_LINKS"]
            },
            category: "music",
        });
    }

    public async exec(msg: Message): Promise<Message> {
        const { music } = msg.guild!;
        if (!music.song) return msg.ctx.send("💤 **| Not Playing anything right now**");
        const { song } = music;
        const percent = music.playTime / song.length * 12;
        const progbar = new Array(12).fill("▬");
        progbar[Math.round(percent)] = "🔘";
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setAuthor(song.requester.tag, song.requester.displayAvatarURL())
            .setTitle(song.title)
            .setURL(song.uri)
            .setThumbnail(song.thumbnail)
            .setDescription(`▶️ ${progbar.join("")} \`[${music.readTime} - ${song.readTime}]\``);
        return msg.ctx.send(embed);
    }
}