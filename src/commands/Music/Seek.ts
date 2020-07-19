import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import CustomError from "../../classes/CustomError";
import { Message } from "discord.js";
import { readableTime } from "../../util/Util";

export default class seekCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "seek", {
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
        });
    }

    public async exec(msg: Message, { time }: { time: number }): Promise<Message> {
        const vc = msg.member!.voice.channel;
        const { music } = msg.guild!;
        let problem = false;
        if(!music.song) return msg.ctx.send("💤 **| Not Playing anything right now**");
        if(!vc) problem = await msg.ctx.send("❌ **| Please Join Voice channel first**").then(() => true);
        else if(music.voiceChannel && music.voiceChannel.id !== vc.id)
            problem = await msg.ctx.send("❌ **| You must use same voice channel with me**").then(() => true);
        else if(time > music.song.length || time < 0)
            problem = await msg.ctx.send("❌ **| Time position is too long or short**").then(() => true);
        if(problem) throw new CustomError("CANCELED");
        music.seek(time);
        return msg.ctx.send(`⏱️ **| Seeked to \`${readableTime(time)}\`**`);
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}