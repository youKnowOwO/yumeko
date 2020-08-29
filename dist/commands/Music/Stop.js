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
let StopCommand = class StopCommand extends Command_1.default {
    async exec(msg) {
        const { music } = msg.guild;
        music.stop();
        return msg.ctx.send("🛑 **| Stopped**");
    }
    ignore(msg) {
        return !!msg.guild.music.song && msg.guild.music.listeners.length < 2;
    }
};
__decorate([
    decorators_1.isMusicPlaying(),
    decorators_1.isMemberInVoiceChannel(),
    decorators_1.isSameVoiceChannel()
], StopCommand.prototype, "exec", null);
StopCommand = __decorate([
    decorators_1.DeclareCommand("stop", {
        aliases: ["stop"],
        description: {
            content: "Clear all song in queue. and stop current song",
            usage: "stop",
            examples: ["stop"]
        },
        category: "music",
        permissions: {
            user: ["MANAGE_GUILD"]
        }
    })
], StopCommand);
exports.default = StopCommand;
