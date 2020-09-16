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
const decorators_1 = require("@yumeko/decorators");
let PlayMoe = class PlayMoe extends Command_1.default {
    async exec(msg, { link }) {
        const track = await msg.guild.music.fetch(link);
        const command = this.collector.commands.get("play");
        return command.exec(msg, { track: track.tracks[0], isSearch: false, dontBind: false });
    }
};
__decorate([
    decorators_1.constantly,
    decorators_1.inhibit(msg => {
        if (msg.guild.music.song)
            return msg.guild.loc.get("COMMAND_MUSIC_PLAYMOE_INHIBIT");
    })
], PlayMoe.prototype, "exec", null);
PlayMoe = __decorate([
    decorators_1.DeclareCommand("play-moe", {
        aliases: ["play-moe", "playmoe"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_MUSIC_PLAYMOE_DESCRIPTION"),
            usage: "play-moe <jpop | kpop>",
            examples: ["play-moe jpop"]
        },
        category: "music",
        args: [
            {
                identifier: "link",
                match: "single",
                prompt: (msg) => msg.guild.loc.get("COMMAND_MUSIC_PLAYMOE_PROMPT"),
                type: (msg, content) => {
                    content = content.toLowerCase();
                    if (!["jpop", "kpop"].includes(content))
                        throw new CustomError_1.default("!PARSING", msg.guild.loc.get("COMMAND_MUSIC_PLAYMOE_INVALID_TYPE"));
                    return `https://listen.moe/${content === "jpop" ? "stream" : "kpop/stream"}`;
                }
            }
        ]
    })
], PlayMoe);
exports.default = PlayMoe;
