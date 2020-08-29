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
let SkipCommand = class SkipCommand extends Command_1.default {
    async exec(msg, { forced }) {
        const { music } = msg.guild;
        if (!forced) {
            const listeners = music.listeners.length;
            if (listeners > 3 && music.song.requester.id !== msg.author.id) {
                if (music.skipVotes.includes(msg.author))
                    return msg.ctx.send("❕ **| You already voted**");
                music.skipVotes.push(msg.author);
                const needed = Math.round(listeners * 0.4);
                if (music.skipVotes.length < needed)
                    return msg.ctx.send(`📢 **| You voted for skip this song, need more votes! **${music.skipVotes.length} / ${needed}**`);
            }
        }
        music.skip();
        return msg.ctx.send("⏭️ **| Skipped**");
    }
};
__decorate([
    decorators_1.isInStream(),
    decorators_1.isMusicPlaying(),
    decorators_1.isMemberInVoiceChannel(),
    decorators_1.isSameVoiceChannel(),
    decorators_1.inhibit((msg, { forced }) => {
        if (forced && !msg.member.permissions.has("MANAGE_GUILD"))
            return "❌ **| Only member with permission \`MANAGE_GUILD\` are allowed**";
    })
], SkipCommand.prototype, "exec", null);
SkipCommand = __decorate([
    decorators_1.DeclareCommand("skip", {
        aliases: ["skip"],
        description: {
            content: "Stop playing current song",
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
], SkipCommand);
exports.default = SkipCommand;
