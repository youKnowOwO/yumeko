"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const SelectionPage_1 = __importDefault(require("@yumeko/util/SelectionPage"));
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
let default_1 = class default_1 extends Command_1.default {
    async exec(msg, { track, isSearch, dontBind }) {
        const vc = msg.member.voice.channel;
        const { music } = msg.guild;
        if (typeof track === "string") {
            const response = await music.fetch(track);
            if (!response.tracks.length)
                return msg.ctx.send(msg.guild.loc.get("COMMAND_UTIL_NO_RESULT_FOUND"));
            if (response.loadType === "PLAYLIST_LOADED") {
                for (const trck of response.tracks)
                    music.add(msg.author, trck);
                msg.ctx.send(msg.guild.loc.get("COMMAND_MUSIC_PLAY_ADD_PLAYLIST", response.playlistInfo.name));
            }
            else {
                let trck = response.tracks[0];
                if (isSearch) {
                    const tracks = response.tracks.splice(0, 5);
                    const embed = new discord_js_1.MessageEmbed()
                        .setColor(this.client.config.color)
                        .setAuthor(msg.guild.loc.get("COMMAND_MUSIC_PLAY_SONG_SELECTION"), "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/twitter/259/musical-note_1f3b5.png")
                        .setDescription(tracks.map((x, i) => `${emojis[i]} **${x.info.title}**`).join("\n"));
                    const resp = new SelectionPage_1.default(msg, {
                        emojis, cancelEmo: "❌",
                        embed, selections: tracks
                    });
                    const result = await resp.start();
                    if (!result)
                        return undefined;
                    trck = result;
                }
                music.add(msg.author, trck);
                if (music.song)
                    msg.ctx.send(msg.guild.loc.get("COMMAND_MUSIC_PLAY_ADD_SONG", trck.info.title));
            }
        }
        else
            music.add(msg.author, track);
        if (!music.voiceChannel) {
            await music.join(vc, msg.channel);
            music.play();
        }
        else if (!dontBind)
            music.textChannel = msg.channel;
    }
};
__decorate([
    decorators_1.constantly,
    decorators_1.isInStream(),
    decorators_1.isMemberInVoiceChannel(),
    decorators_1.isMemberVoiceChannelJoinable(),
    decorators_1.isSameVoiceChannel()
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("play", {
        aliases: ["play", "p"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_MUSIC_PLAY_DESCRIPTION"),
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
                prompt: (msg) => msg.guild.loc.get("COMMAND_MUSIC_PLAY_PROMPT"),
                type: (msg, content) => {
                    try {
                        const url = new URL(content);
                        if (!/^https?:\/\/(www.youtube.com|youtube.com|m.youtube.com|youtu.be)/.test(url.origin))
                            throw new CustomError_1.default("!PARSING", "**Only support source from youtube**");
                        return content;
                    }
                    catch (e) {
                        if (e.name === "!PARSING")
                            throw e;
                        return `ytsearch:${content}`;
                    }
                }
            }
        ]
    })
], default_1);
exports.default = default_1;
