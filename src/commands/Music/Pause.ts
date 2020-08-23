import Command from "@yumeko/classes/Command";
import CustomError from "@yumeko/classes/CustomError";
import { Message } from "discord.js";
import { DeclareCommand } from "@yumeko/decorators";

@DeclareCommand("pause", {
    aliases: ["pause"],
    description: {
        content: "Pause or resume current song",
        usage: "pause",
        examples: ["pause"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    }
})
export default class PauseCommand extends Command {
    public async exec(msg: Message): Promise<Message> {
        const vc = msg.member!.voice.channel;
        const { music } = msg.guild!;
        let problem = false;
        if (!music.song) return msg.ctx.send("💤 **| Not Playing anything right now**");
        if (!vc) problem = await msg.ctx.send("❌ **| Please Join Voice channel first**").then(() => true);
        else if (music.voiceChannel && music.voiceChannel.id !== vc.id)
            problem = await msg.ctx.send("❌ **| You must use same voice channel with me**").then(() => true);
        if (problem) throw new CustomError("CANCELED");
        music.pause();
        return msg.ctx.send(`${music.paused ? "⏸️" : "▶️"} **| ${music .paused ? "Paused" : "Resumed"}.**`);
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}