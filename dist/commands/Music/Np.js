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
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg) {
        const { music } = msg.guild;
        const song = music.song;
        if (song.identifier.includes("https://listen.moe")) {
            const isKR = song.identifier.includes("kpop");
            const { data } = this.client.nowplayMoe[isKR ? "kpop" : "jpop"];
            if (!data)
                return msg.ctx.send(`📻 | **${song.title}\nhttps://listen.moe**`);
            const embed = new discord_js_1.MessageEmbed()
                .setAuthor(data.title, "https://listen.moe/_nuxt/img/logo-square-64.248c1f3.png")
                .setColor(this.client.config.color)
                .setImage(data.cover)
                .setDescription(msg.guild.loc.get("COMMAND_MUSIC_NP_MOE_PARSE", data));
            if (data.event)
                embed.setThumbnail(data.event.image);
            return msg.ctx.send(embed);
        }
        const percent = music.playTime / song.length * 12;
        const progbar = new Array(12).fill("▬");
        progbar[Math.round(percent)] = "🔘";
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.config.color)
            .setAuthor(song.requester.tag, song.requester.displayAvatarURL())
            .setTitle(song.title)
            .setURL(song.uri)
            .setThumbnail(song.thumbnail)
            .setDescription(`▶️ ${progbar.join("")} \`[${music.readTime} - ${song.readTime}]\``);
        return msg.ctx.send(embed);
    }
};
__decorate([
    decorators_1.constantly,
    decorators_1.isMusicPlaying()
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("np", {
        aliases: ["np", "nowplay"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_MUSIC_NP_DESCRIPTION"),
            usage: "np",
            examples: ["np"]
        },
        permissions: {
            client: ["EMBED_LINKS"]
        },
        category: "music",
    })
], default_1);
exports.default = default_1;
