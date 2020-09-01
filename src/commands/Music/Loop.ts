import Command from "@yumeko/classes/Command";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isSameVoiceChannel, isMemberInVoiceChannel, isInStream } from "@yumeko/decorators";

@DeclareCommand("loop", {
    aliases: ["loop"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_MUISC_LOOP_DESCRIPTION"),
        usage: "loop",
        examples: ["loop"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    }
})
export default class LoopCommand extends Command {
    @isInStream()
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    public async exec(msg: Message): Promise<Message> {
        const { music } = msg.guild!;
        music.setLoop(music.loopType === 1 ? 0 : 1);
        return msg.ctx.send(msg.guild!.loc.get(music.loopType === 1 ? "COMMAND_MUISC_LOOP_OFF" : "COMMAND_MUSIC_LOOP_ON"));
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}