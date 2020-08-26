import Command from "@yumeko/classes/Command";
import { MessageEmbed, Message } from "discord.js";
import { DeclareCommand, isMusicPlaying } from "@yumeko/decorators";

@DeclareCommand("np", {
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
})
export default class NpCommand extends Command {
    @isMusicPlaying()
    public async exec(msg: Message): Promise<Message> {
        const { music } = msg.guild!;
        const song = music.song!;
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