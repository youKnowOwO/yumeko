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
const decorators_1 = require("@yumeko/decorators");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg, { forced }) {
        const { music } = msg.guild;
        if (!forced) {
            const listeners = music.listeners.length;
            if (listeners > 3 && music.song.requester.id !== msg.author.id) {
                if (music.skipVotes.includes(msg.author))
                    return msg.ctx.send(msg.ctx.lang("COMMAND_MUSIC_SKIP_ALREADY_VOTE"));
                music.skipVotes.push(msg.author);
                const needed = Math.round(listeners * 0.4);
                if (music.skipVotes.length < needed)
                    return msg.ctx.send(msg.ctx.lang("COMMAND_MUSIC_SKIP_NEED_MORE_VOTE", music.skipVotes.length, needed));
            }
        }
        music.skip();
        return msg.ctx.send(msg.ctx.lang("COMMAND_MUSIC_SKIP_SKIPPED"));
    }
};
__decorate([
    decorators_1.constantly,
    decorators_1.isInStream(),
    decorators_1.isMusicPlaying(),
    decorators_1.isMemberInVoiceChannel(),
    decorators_1.isSameVoiceChannel(),
    decorators_1.inhibit((msg, { forced }) => {
        if (forced && !msg.member.permissions.has("MANAGE_GUILD"))
            return msg.ctx.lang("COMMAND_RUNNER_MISSPERMS", msg.author, "`MANAGE_GUILD`");
    })
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("skip", {
        aliases: ["skip"],
        description: {
            content: (msg) => msg.ctx.lang("COMMAND_MUSIC_SKIP_DESCRIPTION"),
            usage: "skip",
            examples: ["skip", "--force"]
        },
        category: "music",
        args: [
            {
                identifier: "forced",
                match: "flag",
                flag: "force"
            }
        ]
    })
], default_1);
exports.default = default_1;
