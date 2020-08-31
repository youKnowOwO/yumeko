import Command from "@yumeko/classes/Command";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel, inhibit, isInStream } from "@yumeko/decorators";

@DeclareCommand("skip", {
    aliases: ["skip"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_MUSIC_SKIP_DESCRIPTION"),
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
    @inhibit((msg, { forced }: { forced: boolean }) => {
        if (forced && !msg.member!.permissions.has("MANAGE_GUILD"))
            return msg.guild!.loc.get("COMMAND_RUNNER_MISSPERMS", msg.author, "`MANAGE_GUILD`");
    })
    public async exec(msg: Message, { forced }: { forced: boolean }): Promise<Message> {
        const { music } = msg.guild!;
        if (!forced) {
            const listeners = music.listeners.length;
            if (listeners > 3 && music.song!.requester.id !== msg.author.id) {
                if (music.skipVotes.includes(msg.author)) return msg.ctx.send(msg.guild!.loc.get("COMMAND_MUSIC_SKIP_ALREADY_VOTE"));
                music.skipVotes.push(msg.author);
                const needed = Math.round(listeners * 0.4);
                if (music.skipVotes.length < needed)
                    return msg.ctx.send(msg.guild!.loc.get("COMMAND_MUSIC_SKIP_NEED_MORE_VOTE", music.skipVotes.length, needed));
            }
        }
        music.skip();
        return msg.ctx.send(msg.guild!.loc.get("COMMAND_MUSIC_SKIP_SKIPPED"));
    }
}