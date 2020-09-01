import Command from "@yumeko/classes/Command";
import CustomError from "@yumeko/classes/CustomError";
import SelectionPage from "@yumeko/util/SelectionPage";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import type { Track } from "lavalink";
import { DeclareCommand, isMemberInVoiceChannel, isSameVoiceChannel, isMemberVoiceChannelJoinable, isInStream } from "@yumeko/decorators";

const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

@DeclareCommand("play", {
    aliases: ["play", "p"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_MUSIC_PLAY_DESCRIPTION"),
        usage: "play <query> [--search] [--dontbind]",
        examples: ["play unlocated hell", "play nyan cat --search"]
    },
    category: "music",
    permissions: {
        user: ["EMBED_LINKS", "ADD_REACTIONS"]
    },
    args: [
        {
            identifier: "isSearch",
            match: "flag",
            flag: "search"
        },
        {
            identifier: "dontBind",
            match: "flag",
            flag: "dontbind"
        },
        {
            identifier: "track",
            match: "rest",
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_MUSIC_PLAY_PROMPT"),
            type: (msg: Message, content: string): string => {
                try {
                    const url = new URL(content);
                    if (!/^https?:\/\/(www.youtube.com|youtube.com|m.youtube.com|youtu.be)/.test(url.origin))
                        throw new CustomError("!PARSING", "**Only support source from youtube**");
                    return content;
                } catch(e) {
                    if (e.name === "!PARSING") throw e;
                    return `ytsearch:${content}`;
                }
            }
        }
    ]
})
export default class PlayCommand extends Command {
    @isInStream()
    @isMemberInVoiceChannel()
    @isMemberVoiceChannelJoinable()
    @isSameVoiceChannel()
    public async exec(msg: Message, { track, isSearch, dontBind }: { track: string | Track; isSearch: boolean; dontBind: boolean }): Promise<Message|void> {
        const vc = msg.member!.voice.channel;
        const { music } = msg.guild!;
        if (typeof track === "string") {
            const response = await music.fetch(track);
            if (!response.tracks.length) return msg.ctx.send(msg.guild!.loc.get("COMMAND_UTIL_NO_RESULT_FOUND"));
            if (response.loadType === "PLAYLIST_LOADED") {
                for (const trck of response.tracks) music.add(msg.author, trck);
                msg.ctx.send(msg.guild!.loc.get("COMMAND_MUSIC_PLAY_ADD_PLAYLIST", response.playlistInfo.name!));
            } else {
                let trck = response.tracks[0];
                if (isSearch) {
                    const tracks = response.tracks.splice(0, 5);
                    const embed = new MessageEmbed()
                        .setColor(this.client.config.color)
                        .setAuthor(msg.guild!.loc.get("COMMAND_MUSIC_PLAY_SONG_SELECTION"), "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/twitter/259/musical-note_1f3b5.png")
                        .setDescription(tracks.map((x, i) => `${emojis[i]} **${x.info.title}**`).join("\n"));
                    const resp: SelectionPage<Track> = new SelectionPage(msg, {
                        emojis, cancelEmo: "❌",
                        embed, selections: tracks
                    });
                    const result = await resp.start();
                    if (!result) return undefined;
                    trck = result;
                }
                music.add(msg.author, trck);
                if (music.song) msg.ctx.send(msg.guild!.loc.get("COMMAND_MUSIC_PLAY_ADD_SONG", trck.info.title));
            }
        } else music.add(msg.author, track);
        if (!music.voiceChannel) {
            await music.join(vc!, msg.channel as TextChannel);
            music.play();
        } else if (!dontBind) music.textChannel = msg.channel as TextChannel;
    }
}