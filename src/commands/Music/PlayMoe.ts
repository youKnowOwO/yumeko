import type PlayCommand from "@yumeko/commands/Music/Play";
import Command from "@yumeko/classes/Command";
import CustomError from "@yumeko/classes/CustomError";
import type { Message } from "discord.js";
import { DeclareCommand, inhibit, constantly } from "@yumeko/decorators";

@DeclareCommand("play-moe", {
    aliases: ["play-moe", "playmoe"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_MUSIC_PLAYMOE_DESCRIPTION"),
        usage: "play-moe <jpop | kpop>",
        examples: ["play-moe jpop"]
    },
    category: "music",
    args: [
        {
            identifier: "link",
            match: "single",
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_MUSIC_PLAYMOE_PROMPT"),
            type: (msg, content): string => {
                content = content.toLowerCase();
                if (!["jpop", "kpop"].includes(content))
                    throw new CustomError("!PARSING", msg.guild!.loc.get("COMMAND_MUSIC_PLAYMOE_INVALID_TYPE"));
                return `https://listen.moe/${content === "jpop" ? "stream" : "kpop/stream"}`;
            }
        }
    ]
})
export default class PlayMoe extends Command {
    @constantly
    @inhibit(msg => {
        if (msg.guild!.music.song) return msg.guild!.loc.get("COMMAND_MUSIC_PLAYMOE_INHIBIT");
    })
    public async exec(msg: Message, { link }: { link: string }): Promise<Message | void> {
        const track = await msg.guild!.music.fetch(link);
        const command = this.collector!.commands.get("play") as PlayCommand;
        return command.exec(msg, { track: track.tracks[0], isSearch: false, dontBind: false });
    }
}