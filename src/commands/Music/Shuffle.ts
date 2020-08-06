import Command from "../../classes/Command";
import CustomError from "../../classes/CustomError";
import { Message } from "discord.js";
import { DeclareCommand } from "../../decorators";
import { shuffle } from "../../util/Util";

@DeclareCommand("shuffle", {
    aliases: ["shuffle"],
    description: {
        content: "shuffle curent queue",
        usage: "shuffle",
        examples: ["shuffle"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    }
})
export default class ShuffleCommand extends Command {
    public async exec(msg: Message): Promise<Message> {
        const vc = msg.member!.voice.channel;
        const { music } = msg.guild!;
        let problem = false;
        if (!music.song) return msg.ctx.send("💤 **| Not Playing anything right now**");
        if (!vc) problem = await msg.ctx.send("❌ **| Please Join Voice channel first**").then(() => true);
        else if (music.voiceChannel && music.voiceChannel.id !== vc.id)
            problem = await msg.ctx.send("❌ **| You must use same voice channel with me**").then(() => true);
        if (problem) throw new CustomError("CANCELED");
        music.queue = shuffle(music.queue);
        return msg.channel.send("🔀 **| Queue shuffled**");
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}