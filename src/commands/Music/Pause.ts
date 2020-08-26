import Command from "@yumeko/classes/Command";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel } from "@yumeko/decorators";

@DeclareCommand("pause", {
    aliases: ["pause"],
    description: {
        content: "Pause or resume current song",
        usage: "pause",
        examples: ["pause"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    }
})
export default class PauseCommand extends Command {
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    public async exec(msg: Message): Promise<Message> {
        const { music } = msg.guild!;
        music.pause();
        return msg.ctx.send(`${music.paused ? "⏸️" : "▶️"} **| ${music .paused ? "Paused" : "Resumed"}.**`);
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}