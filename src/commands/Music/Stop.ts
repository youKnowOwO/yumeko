import Command from "../../classes/Command";
import CustomError from "../../classes/CustomError";
import { Message } from "discord.js";
import { DeclareCommand } from "../../decorators";

@DeclareCommand("stop", {
    aliases: ["stop"],
    description: {
        content: "Clear all song in queue. and stop current song",
        usage: "stop",
        examples: ["stop"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    }
})
export default class StopCommand extends Command {
    public async exec(msg: Message): Promise<Message> {
        const vc = msg.member!.voice.channel;
        const { music } = msg.guild!;
        if (!music.song) return msg.ctx.send("💤 **| Not Playing anything right now**");
        let problem = false;
        if (!vc) problem = await msg.ctx.send("❌ **| Please Join Voice channel first**").then(() => true);
        else if (music.voiceChannel && music.voiceChannel.id !== vc.id)
            problem = await msg.ctx.send("❌ **| You must use same voice channel with me**").then(() => true);
        if (problem) throw new CustomError("CANCELED");
        music.stop();
        return msg.ctx.send("🛑 **| Stopped**");
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && msg.guild!.music.listeners.length < 2;
    }
}