import Command from "@yumeko/classes/Command";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel, constantly } from "@yumeko/decorators";

@DeclareCommand("stop", {
    aliases: ["stop"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_MUSIC_STOP_DESCRIPTION"),
        usage: "stop",
        examples: ["stop"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    }
})
export default class extends Command {
    @constantly
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    public async exec(msg: Message): Promise<Message> {
        const { music } = msg.guild!;
        music.stop();
        return msg.ctx.send(msg.ctx.lang("COMMAND_MUSIC_STOP_STOPPED"));
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && msg.guild!.music.listeners.length < 2;
    }
}