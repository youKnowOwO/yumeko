import Command from "@yumeko/classes/Command";
import { MessageEmbed, Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, constantly } from "@yumeko/decorators";

@DeclareCommand("np", {
    aliases: ["np", "nowplay"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_MUSIC_NP_DESCRIPTION"),
        usage: "np",
        examples: ["np"]
    },
    permissions: {
        client: ["EMBED_LINKS"]
    },
    category: "music",
})
export default class extends Command {
    @constantly
    @isMusicPlaying()
    public async exec(msg: Message): Promise<Message> {
        const { music } = msg.guild!;
        const song = music.song!;
        if (song.identifier.includes("https://listen.moe")) {
            const isKR = song.identifier.includes("kpop");
            const { data } = this.client.nowplayMoe[isKR ? "kpop" : "jpop"];
            if (!data) return msg.ctx.send(`📻 | **${song.title}\nhttps://listen.moe**`);
            const embed = new MessageEmbed()
                .setAuthor(data.title, "https://listen.moe/_nuxt/img/logo-square-64.248c1f3.png")
                .setColor(this.client.config.color)
                .setImage(data.cover)
                .setDescription(msg.ctx.lang("COMMAND_MUSIC_NP_MOE_PARSE", data));
            if (data.event) embed.setThumbnail(data.event.image);
            return msg.ctx.send(embed);
        }
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