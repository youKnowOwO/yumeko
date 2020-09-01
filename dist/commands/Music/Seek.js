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
const Util_1 = require("@yumeko/util/Util");
const decorators_1 = require("@yumeko/decorators");
let SeekCommand = class SeekCommand extends Command_1.default {
    async exec(msg, { time }) {
        const { music } = msg.guild;
        music.seek(time);
        return msg.ctx.send(msg.guild.loc.get("COMMAND_MUSIC_SEEK_SEEKED", Util_1.readableTime(time)));
    }
    ignore(msg) {
        return !!msg.guild.music.song && (msg.guild.music.listeners.length < 2 ||
            msg.guild.music.song.requester.id === msg.author.id);
    }
};
__decorate([
    decorators_1.isInStream(),
    decorators_1.isMusicPlaying(),
    decorators_1.isMemberInVoiceChannel(),
    decorators_1.isSameVoiceChannel(),
    decorators_1.inhibit((msg, { time }) => {
        if (!msg.guild.music.song.isSeekable)
            return msg.guild.loc.get("COMMAND_MUSIC_SEEK_NOT_SEEKABLE");
        if (msg.guild.music.song.length < time || time < 0)
            return msg.guild.loc.get("COMMAND_MUSIC_SEEK_TOO_LONG_OR_SHORT");
    })
], SeekCommand.prototype, "exec", null);
SeekCommand = __decorate([
    decorators_1.DeclareCommand("seek", {
        aliases: ["seek", "jumpto"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_MUSIC_SEEK_DESCRIPTION"),
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
                prompt: (msg) => msg.guild.loc.get("COMMAND_MUSIC_SEEK_PROMPT")
            }
        ]
    })
], SeekCommand);
exports.default = SeekCommand;
