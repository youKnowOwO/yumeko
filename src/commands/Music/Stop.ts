import Command from "@yumeko/classes/Command";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel } from "@yumeko/decorators";

@DeclareCommand("stop", {
    aliases: ["stop"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_MUSIC_STOP_DESCRIPTION"),
        usage: "stop",
        examples: ["stop"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    }
})
export default class StopCommand extends Command {
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    public async exec(msg: Message): Promise<Message> {
        const { music } = msg.guild!;
        music.stop();
        return msg.ctx.send(msg.guild!.loc.get("COMMAND_MUSIC_STOP_STOPPED"));
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && msg.guild!.music.listeners.length < 2;
    }
}