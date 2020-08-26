import Command from "@yumeko/classes/Command";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isSameVoiceChannel, isMemberInVoiceChannel } from "@yumeko/decorators";

@DeclareCommand("loop", {
    aliases: ["loop"],
    description: {
        content: "Loop current queue",
        usage: "loop",
        examples: ["loop"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    }
})
export default class LoopCommand extends Command {
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    public async exec(msg: Message): Promise<Message> {
        const { music } = msg.guild!;
        music.setLoop(music.loopType === 1 ? 0 : 1);
        return msg.ctx.send(`🔁 **| ${music.loopType === 1 ? "Looping current queue." : "Disabled."}.**`);
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}