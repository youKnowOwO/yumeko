import Command from "@yumeko/classes/Command";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel, isInStream } from "@yumeko/decorators";

@DeclareCommand("repeat", {
    aliases: ["repeat"],
    description: {
        content: "repeat current queue",
        usage: "repeat",
        examples: ["repeat"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    }
})
export default class RepeatCommand extends Command {
    @isInStream()
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    public async exec(msg: Message): Promise<Message> {
        const { music } = msg.guild!;
        music.setLoop(music.loopType === 2 ? 0 : 2);
        return msg.ctx.send(`🔁 **| ${music.loopType === 2 ? "repeating current song." : "Disabled."}.**`);
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}