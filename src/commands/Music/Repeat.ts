import Command from "@yumeko/classes/Command";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel, isInStream, constantly } from "@yumeko/decorators";

@DeclareCommand("repeat", {
    aliases: ["repeat"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_MUSIC_REPEAT_DESCRIPTION"),
        usage: "repeat",
        examples: ["repeat"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    }
})
export default class extends Command {
    @constantly
    @isInStream()
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    public async exec(msg: Message): Promise<Message> {
        const { music } = msg.guild!;
        music.setLoop(music.loopType === 2 ? 0 : 2);
        return msg.ctx.send(msg.guild!.loc.get(music.loopType === 2 ? "COMMAND_MUSIC_REPEAT_ON" : "COMMAND_MUSIC_REPEAT_OFF"));
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}