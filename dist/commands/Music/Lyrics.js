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
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const decorators_1 = require("@yumeko/decorators");
const Util_1 = require("@yumeko/util/Util");
const discord_js_1 = require("discord.js");
const Pagination_1 = __importDefault(require("@yumeko/util/Pagination"));
let LyricsCommand = class LyricsCommand extends Command_1.default {
    async exec(msg, { title }) {
        const result = await this.getLyrics(title);
        if (!result)
            return msg.ctx.send(msg.guild.loc.get("COMMAND_UTIL_NO_RESULT_FOUND"));
        const pages = Util_1.chunk(result.lyrics, 2048);
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.config.color)
            .setURL(result.links.genius)
            .setTitle(result.title)
            .setThumbnail(result.thumbnail.genius);
        return new Pagination_1.default(msg, {
            embed, pages,
            edit: (index, emb, page) => emb.setDescription(page).setFooter(`Page ${index + 1} of ${pages.length}`)
        }).start();
    }
    async getLyrics(title) {
        const { body } = await node_superfetch_1.default.get("https://some-random-api.ml/lyrics")
            .query({ title });
        if (body.error)
            return undefined;
        return body;
    }
};
LyricsCommand = __decorate([
    decorators_1.DeclareCommand("lyrics", {
        aliases: ["lyrics", "lyrics"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_MUSIC_LYRICS_DESCRIPTION"),
            usage: "lyrics",
            examples: ["lyrics Moo Doja Cat"]
        },
        category: "music",
        args: [
            {
                identifier: "title",
                match: "rest",
                type: "string",
                prompt: "What the title of the song ?"
            }
        ]
    })
], LyricsCommand);
exports.default = LyricsCommand;
