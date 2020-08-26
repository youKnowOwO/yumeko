import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { readableTime } from "@yumeko/util/Util";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel, inhibit } from "@yumeko/decorators";

@DeclareCommand("seek", {
    aliases: ["seek", "jumpto"],
    description: {
        content: "Stop playing current song",
        usage: "seek <time position>",
        examples: ["seek 00:30"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    },
    args: [
        {
            identifier: "time",
            match: "single",
            type: "timespan",
            prompt: "What time position do you want jump to ?"
        }
    ]
})
export default class SeekCommand extends Command {
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    @inhibit((msg, { time }: { time: number}) => {
        if (msg.guild!.music.song!.length < time || time < 0)
            return "❌ **| Time position is too long or short**";
    })
    public async exec(msg: Message, { time }: { time: number }): Promise<Message> {
        const { music } = msg.guild!;
        music.seek(time);
        return msg.ctx.send(`⏱️ **| Seeked to \`${readableTime(time)}\`**`);
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}