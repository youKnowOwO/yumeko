import Command from "@yumeko/classes/Command";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel, isInStream, constantly } from "@yumeko/decorators";
import { shuffle } from "@yumeko/util/Util";

@DeclareCommand("shuffle", {
    aliases: ["shuffle"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_MUSIC_SHUFFLE_DESCRIPTION"),
        usage: "shuffle",
        examples: ["shuffle"]
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
        music.queue = shuffle(music.queue);
        return msg.channel.send(msg.ctx.lang("COMMAND_MUSIC_SHUFFLE_SHUFFLED"));
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}