import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import CustomError from "../../classes/CustomError";
import { Message } from "discord.js";

export default class RepeatCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "repeat", {
            aliases: ["repeat"],
            description: {
                content: "repeat current queue",
                usage: "repeat",
                examples: ["repeat"]
            },
            category: "music",
            permissions: {
                user: ["MANAGE_GUILD"]
            }
        });
    }

    public async exec(msg: Message): Promise<Message> {
        const vc = msg.member!.voice.channel;
        const { music } = msg.guild!;
        let problem = false;
        if (!music.song) return msg.ctx.send("💤 **| Not Playing anything right now**");
        if (!vc) problem = await msg.ctx.send("❌ **| Please Join Voice channel first**").then(() => true);
        else if (music.voiceChannel && music.voiceChannel.id !== vc.id)
            problem = await msg.ctx.send("❌ **| You must use same voice channel with me**").then(() => true);
        if (problem) throw new CustomError("CANCELED");
        music.setLoop(music.loopType === 2 ? 0 : 2);
        return msg.ctx.send(`🔁 **| ${music.loopType === 2 ? "repeating current song." : "Disabled."}.**`);
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}