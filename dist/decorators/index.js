"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInStream = exports.isMemberVoiceChannelJoinable = exports.isMemberInVoiceChannel = exports.isSameVoiceChannel = exports.isMusicPlaying = exports.inhibit = exports.DeclareCommand = void 0;
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
function DeclareCommand(identifier, option) {
    return function (target) {
        return new Proxy(target, {
            construct: (ctx, [client]) => new ctx(client, identifier, option)
        });
    };
}
exports.DeclareCommand = DeclareCommand;
function inhibit(func) {
    return function (_, __, descriptor) {
        const method = descriptor.value;
        if (!method)
            throw new CustomError_1.default("DecoratorError", "Descriptor value isn'5 provided");
        descriptor.value = async function (msg, ...args) {
            const message = await func(msg, ...args);
            if (message) {
                msg.ctx.send(message);
                throw new CustomError_1.default("CANCELED");
            }
            await method.call(this, msg, ...args);
        };
    };
}
exports.inhibit = inhibit;
function isMusicPlaying() {
    return inhibit(msg => {
        if (!msg.guild.music.song)
            return msg.guild.loc.get("COMMAND_MUSIC_NOT_PLAY");
    });
}
exports.isMusicPlaying = isMusicPlaying;
function isSameVoiceChannel() {
    return inhibit(msg => {
        if (msg.guild.me.voice.channelID && msg.guild.me.voice.channelID !== msg.member.voice.channelID)
            return msg.guild.loc.get("COMMAND_MUSIC_NOT_SAME_VC", msg.guild.me.voice.channel);
    });
}
exports.isSameVoiceChannel = isSameVoiceChannel;
function isMemberInVoiceChannel() {
    return inhibit(msg => {
        if (!msg.member.voice.channelID)
            return msg.guild.loc.get("COMMAND_MUISC_MEMBER_NOT_VC");
    });
}
exports.isMemberInVoiceChannel = isMemberInVoiceChannel;
function isMemberVoiceChannelJoinable(ignoreWhenSame = true) {
    return inhibit(msg => {
        const vc = msg.member.voice.channel;
        if (ignoreWhenSame && msg.guild.me.voice.channelID && msg.guild.me.voice.channelID === msg.member.voice.channelID)
            return undefined;
        if (!vc.permissionsFor(msg.guild.me).has(["CONNECT", "SPEAK"]))
            return msg.guild.loc.get("COMMAND_MUSIC_LACK_PERM_CONNECT_OR_SPEAK");
        else if (!vc.joinable)
            return msg.guild.loc.get("COMMAND_MUSIC_VC_NOT_JOINABLE");
    });
}
exports.isMemberVoiceChannelJoinable = isMemberVoiceChannelJoinable;
function isInStream() {
    return inhibit(msg => {
        if (msg.guild.music.song && msg.guild.music.song.isStream)
            return msg.guild.loc.get("COMMAND_MUSIC_CANT_PLAY_CAUSE_STREAM");
    });
}
exports.isInStream = isInStream;
