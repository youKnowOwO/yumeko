import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import CustomError from "@yumeko/classes/CustomError";
import { Message } from "discord.js";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel, constantly } from "@yumeko/decorators";

@DeclareCommand("volume", {
    aliases: ["volume"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_MUSIC_VOLUME_DESCRIPTION"),
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
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_MUSIC_VOLUME_PROMPT"),
            type: (_: Message, content: string): number => {
                const volume = (_.client as YumekoClient).collector.runner.argsParser.getType("number")(_, content) as any;
                if (volume > 120) throw new CustomError("!PARSING", "**Volume is too high. max \`120\`**");
                if (volume < 0) throw new CustomError("!PARSING", "Volume is too low. min \`0\`");
                return volume;
            }
        }
    ]
})
export default class extends Command {
    @constantly
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    public async exec(msg: Message, { amount }: { amount: number }): Promise<Message> {
        const { music } = msg.guild!;
        music.setVolume(amount);
        return msg.ctx.send(msg.guild!.loc.get("COMMAND_MUSIC_VOLUME_CHANGE", amount));
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}