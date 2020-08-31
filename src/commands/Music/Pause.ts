import Command from "@yumeko/classes/Command";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel, isInStream } from "@yumeko/decorators";

@DeclareCommand("pause", {
    aliases: ["pause"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_MUSIC_PAUSE_DESCRIPTION"),
        usage: "pause",
        examples: ["pause"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    }
})
export default class PauseCommand extends Command {
    @isInStream()
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    public async exec(msg: Message): Promise<Message> {
        const { music } = msg.guild!;
        music.pause();
        return msg.ctx.send(msg.guild!.loc.get(music.paused ? "COMMAND_MUSIC_PAUSE_ON" : "COMMAND_MUSIC_PAUSE_OFF"));
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}