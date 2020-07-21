import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import CustomError from "../../classes/CustomError";
import SelectionPage from "../../util/SelectionPage";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import type { Track } from "lavalink";

const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

export default class PlayCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "play", {
            aliases: ["play", "p"],
            description: {
                content: "Play some songs",
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
                    prompt: "What song do you wany to play ?",
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
        });
    }

    public async exec(msg: Message, { track, isSearch, dontBind }: { track: string | Track; isSearch: boolean; dontBind: boolean }): Promise<void> {
        const vc = msg.member!.voice.channel;
        const { music } = msg.guild!;
        let problem = false;
        if (!vc) problem = await msg.ctx.send("❌ **| Please Join Voice channel first**").then(() => true);
        else if (music.voiceChannel && music.voiceChannel.id !== vc.id)
            problem = await msg.ctx.send("❌ **| You must use same voice channel with me**").then(() => true);
        else if (!vc.permissionsFor(msg.guild!.me!)!.has(["CONNECT", "SPEAK"]))
            problem = await msg.ctx.send("❌ **| I Don't have permissions \`CONNECT\` or \`SPEAK\`**").then(() => true);
        else if (!vc.joinable) problem = await msg.ctx.send("❌ **| Voice channel isn't joinable**").then(() => true);
        if (problem) throw new CustomError("CANCELED");
        if (typeof track === "string") {
            const response = await music.fetch(track);
            if (!response.tracks.length) return msg.ctx.send("🚫 No result found").then(() => undefined);
            if (response.loadType === "PLAYLIST_LOADED") {
                for (const trck of response.tracks) music.add(msg.author, trck);
                msg.ctx.send(`✅ **| Succes Added Playlist:** __**${response.playlistInfo.name}**__`);
            } else if (response.loadType === "SEARCH_RESULT") {
                let trck = response.tracks[0];
                if (isSearch) {
                    const tracks = response.tracks.splice(0, 5);
                    const embed = new MessageEmbed()
                        .setColor(this.client.config.color)
                        .setAuthor("Songs Selection", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/twitter/259/musical-note_1f3b5.png")
                        .setDescription(tracks.map((x, i) => `${emojis[i]} **${x.info.title}**`).join("\n"));
                    const resp: SelectionPage<Track> = new SelectionPage(msg, {
                        emojis, cancelEmo: "❌",
                        embed, selections: tracks
                    });
                    const result = await resp.start();
                    if (!result) return;
                    trck = result;
                }
                music.add(msg.author, trck);
                if (music.song) msg.ctx.send(`✅ **| Added to queue:** __**${trck.info.title}**__`);
            }
        } else music.add(msg.author, track);
        if (!music.voiceChannel) {
            await music.join(vc!, msg.channel as TextChannel);
            music.play();
        } else if (!dontBind) music.textChannel = msg.channel as TextChannel;
    }
}