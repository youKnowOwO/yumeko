import Command from "@yumeko/classes/Command";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel, inhibit, isInStream } from "@yumeko/decorators";

@DeclareCommand("skip", {
    aliases: ["skip"],
    description: {
        content: "Stop playing current song",
        usage: "skip",
        examples: ["skip", "--force"]
    },
    category: "music",
    args: [
        {
            identifier: "forced",
            match: "flag",
            flag: "force"
        }
    ]
})
export default class SkipCommand extends Command {
    @isInStream()
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    @inhibit((msg, { forced }: { forced: string }) => {
        if (forced && !msg.member!.permissions.has("MANAGE_GUILD"))
            return "❌ **| Only member with permission \`MANAGE_GUILD\` are allowed**";
    })
    public async exec(msg: Message, { forced }: { forced: string }): Promise<Message> {
        const { music } = msg.guild!;
        if (!forced) {
            const listeners = music.listeners.length;
            if (listeners > 3 && music.song!.requester.id !== msg.author.id) {
                if (music.skipVotes.includes(msg.author)) return msg.ctx.send("❕ **| You already voted**");
                music.skipVotes.push(msg.author);
                const needed = Math.round(listeners * 0.4);
                if (music.skipVotes.length < needed)
                    return msg.ctx.send(`📢 **| You voted for skip this song, need more votes! **${music.skipVotes.length} / ${needed}**`);
            }
        }
        music.skip();
        return msg.ctx.send("⏭️ **| Skipped**");
    }
}