import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import CustomError from "../../classes/CustomError";
import { Message } from "discord.js";

export default class VolumeCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "volume", {
            aliases: ["volume"],
            description: {
                content: "Stop playing current song",
                usage: "volume <amount>",
                examples: ["volume 100"]
            },
            category: "music",
            permissions: {
                user: ["MANAGE_GUILD"]
            },
            args: [
                {
                    identifier: "amount",
                    match: "single",
                    prompt: "What time position do you want jump to ?",
                    type: (_: Message, content: string): number => {
                        const volume = this.collector!.runner.argsParser.getType("number")(_, content) as any;
                        if(volume > 120) throw new CustomError("!PARSING", "**Volume is too high. max \`120\`**");
                        if(volume < 0) throw new CustomError("!PARSING", "Volume is too low. min \`0\`");
                        return volume;
                    }
                }
            ]
        });
    }

    public async exec(msg: Message, { amount }: { amount: number }): Promise<Message> {
        const vc = msg.member!.voice.channel;
        const { music } = msg.guild!;
        let problem = false;
        if(!music.song) return msg.ctx.send("💤 **| Not Playing anything right now**");
        if(!vc) problem = await msg.ctx.send("❌ **| Please Join Voice channel first**").then(() => true);
        else if(music.voiceChannel && music.voiceChannel.id !== vc.id)
            problem = await msg.ctx.send("❌ **| You must use same voice channel with me**").then(() => true);
        if(problem) throw new CustomError("CANCELED");
        music.setVolume(amount);
        return msg.ctx.send(`🔉 **| Change Volume to \`${amount}\`**`);
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}