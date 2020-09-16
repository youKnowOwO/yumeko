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
const Song_1 = __importDefault(require("@yumeko/classes/Song"));
const Util_1 = require("@yumeko/util/Util");
const decorators_1 = require("@yumeko/decorators");
var LoopType;
(function (LoopType) {
    LoopType[LoopType["NONE"] = 0] = "NONE";
    LoopType[LoopType["ALL"] = 1] = "ALL";
    LoopType[LoopType["ONE"] = 2] = "ONE";
})(LoopType || (LoopType = {}));
class MusicHandler {
    constructor(guild) {
        this.guild = guild;
        this.queue = [];
        this.skipVotes = [];
        this.paused = false;
        this.loopType = LoopType.NONE;
        this.volume = 100;
        this.lastUpdate = Date.now();
        this.position = 0;
        this.client = guild.client;
        this.player.on("event", this.onEvent.bind(this));
    }
    play() {
        this.oldSong = this.song;
        this.song = this.queue.shift();
        this.skipVotes = [];
        this.player.play(this.song.track);
        this.updatePosition(0);
        this.paused = false;
    }
    async join(vc, channel) {
        await this.player.join(typeof vc === "string" ? vc : vc.id);
        this.textChannel = channel;
    }
    pause() {
        this.paused = !this.paused;
        this.player.pause(this.paused);
    }
    setVolume(volume) {
        this.volume = volume;
        this.player.setVolume(volume);
    }
    add(user, track) {
        const song = new Song_1.default(track, user);
        this.queue.push(song);
        return song;
    }
    fetch(query) {
        return this.client.lavalink.load(query);
    }
    skip() {
        return this.player.stop();
    }
    stop() {
        this.queue = [];
        this.loopType = LoopType.NONE;
        return this.skip();
    }
    seek(time) {
        this.player.seek(time);
        this.updatePosition(time);
    }
    setLoop(type) {
        this.loopType = type;
    }
    onEvent(data) {
        switch (data.type) {
            case "TrackStartEvent":
                this.updatePosition(0);
                this.guild.me.voice.setSelfDeaf(true);
                if (this.oldSong && this.oldSong.identifier === this.song.identifier)
                    break;
                this.textChannel.send(this.guild.loc.get("COMMAND_MUSIC_PLAYING", this.song.title));
                break;
            case "TrackEndEvent":
                if (data.reason === "REPLACED")
                    break;
                if (this.loopType === LoopType.ALL)
                    this.queue.push(this.song);
                else if (this.loopType === LoopType.ONE)
                    this.queue.unshift(this.song);
                if (this.queue.length)
                    return this.play();
                this.reset();
                this.player.leave();
                break;
            case "TrackExceptionEvent":
                this.textChannel.send(this.guild.loc.get("COMMAND_MUSIC_GET_EXCEPTION", Util_1.codeBlock("java", data.error)));
                break;
        }
    }
    reset() {
        this.volume = 100;
        this.position = 0;
        this.oldSong = undefined;
        this.song = undefined;
    }
    updatePosition(position) {
        this.position = position;
        this.lastUpdate = Date.now();
    }
    get player() {
        return this.client.lavalink.players.get(this.guild.id);
    }
    get voiceChannel() {
        return this.guild.me.voice.channel;
    }
    get playTime() {
        return this.position + (Date.now() - this.lastUpdate);
    }
    get readTime() {
        return Util_1.readableTime(this.playTime);
    }
    get listeners() {
        if (!this.voiceChannel)
            return [];
        const users = [];
        for (const member of this.voiceChannel.members.array()) {
            if (member.user.bot || member.voice.deaf)
                continue;
            users.push(member.user);
        }
        return users;
    }
}
__decorate([
    decorators_1.hide
], MusicHandler.prototype, "client", void 0);
__decorate([
    decorators_1.hide
], MusicHandler.prototype, "lastUpdate", void 0);
__decorate([
    decorators_1.hide
], MusicHandler.prototype, "position", void 0);
exports.default = MusicHandler;
