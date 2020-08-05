import Command from "../../classes/Command";
import CustomError from "../../classes/CustomError";
import { Message } from "discord.js";
import { DeclareCommand } from "../../decorators";

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
    public async exec(msg: Message, { forced }: { forced: string }): Promise<Message> {
        const vc = msg.member!.voice.channel;
        const { music } = msg.guild!;
        let problem = false;
        if (!music.song) return msg.ctx.send("💤 **| Not Playing anything right now**");
        if (!vc) problem = await msg.ctx.send("❌ **| Please Join Voice channel first**").then(() => true);
        else if (music.voiceChannel && music.voiceChannel.id !== vc.id)
            problem = await msg.ctx.send("❌ **| You must use same voice channel with me**").then(() => true);
        else if (forced && !msg.member!.permissions.has("MANAGE_GUILD"))
            problem = await msg.ctx.send("❌ **| Only member with permission \`MANAGE_GUILD\` are allowed**").then(() => true);
        if (problem) throw new CustomError("CANCELED");
        if (!forced) {
            const listeners = music.listeners.length;
            if (listeners > 3 && music.song.requester.id !== msg.author.id) {
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