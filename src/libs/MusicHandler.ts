import YumekoClient from "../classes/Client";
import Song from "../classes/Song";
import type { Guild, TextChannel, VoiceChannel, User } from "discord.js";
import type { Player, Track, TrackResponse } from "lavalink";
import { readableTime, codeBlock } from "../util/Util";

enum LoopType {
    NONE,
    ALL,
    ONE
}

export default class MusicHandler {
    public client: YumekoClient;
    public queue: Song[] = [];
    public skipVotes: User[] = [];
    public paused = false;
    public song?: Song;
    public oldSong?: Song;
    public loopType: LoopType = LoopType.NONE;
    public textChannel?: TextChannel;
    private lastUpdate = Date.now();
    private position = 0;

    // filters
    public volume = 100;

    public constructor(public guild: Guild) {
        this.client = (guild.client as YumekoClient);
        this.player.on("event", this.onEvent.bind(this));
    }

    public play(): void {
        this.oldSong = this.song;
        this.song = this.queue.shift();
        this.skipVotes = [];
        this.player.play(this.song!.track);
        this.updatePosition(0);
        this.paused = false;
    }

    public async join(vc: VoiceChannel|string, channel: TextChannel): Promise<void> {
        await this.player.join(typeof vc === "string" ? vc : vc.id, { deaf: true });
        this.textChannel = channel;
    }

    public pause(): void {
        this.paused = !this.paused;
        this.player.pause(this.paused);
    }

    public setVolume(volume: number): void {
        this.volume = volume;
        this.player.setVolume(volume);
    }

    public add(user: User, track: Track): Song {
        const song = new Song(track, user);
        this.queue.push(song);
        return song;
    }

    public fetch(query: string): Promise<TrackResponse> {
        return this.client.lavalink.load(query);
    }

    public skip(): Promise<void> {
        return this.player.stop();
    }

    public stop(): Promise<void> {
        this.queue = [];
        this.loopType = LoopType.NONE;
        return this.skip();
    }

    public seek(time: number): void {
        this.player.seek(time);
        this.updatePosition(time);
    }

    public setLoop(type: LoopType): void {
        this.loopType = type;
    }

    private onEvent(data: any): void {
        switch(data.type) {
            case "TrackStartEvent":
                this.updatePosition(0);
                if (this.oldSong && this.oldSong.identifier === this.song!.identifier) break;
                this.textChannel!.send(`🎶 **Now Playing:** __**${this.song!.title}**__`);
                break;
            case "TrackEndEvent":
                if (data.reason === "REPLACED") break;
                if (this.loopType === LoopType.ALL) this.queue.push(this.song!);
                else if (this.loopType === LoopType.ONE) this.queue.unshift(this.song!);
                if (this.queue.length) return this.play();
                this.reset();
                this.player.leave();
                break;
            case "TrackExceptionEvent":
                this.textChannel!.send(`❌ **| Please try again.** ${codeBlock("java", data.error)}`);
                break;
        }
    }

    private reset(): void {
        this.volume = 100;
        this.position = 0;
        this.oldSong = undefined;
        this.song = undefined;
    }

    private updatePosition(position: number): void {
        this.position = position;
        this.lastUpdate = Date.now();
    }

    public get player(): Player {
        return this.client.lavalink.players.get(this.guild.id);
    }

    public get voiceChannel(): VoiceChannel|null {
        return this.guild.me!.voice.channel;
    }

    public get playTime(): number {
        return this.position + (Date.now() - this.lastUpdate);
    }

    public get readTime(): string {
        return readableTime(this.playTime);
    }

    public get listeners(): User[] {
        if (!this.voiceChannel) return [];
        const users: User[] = [];
        for (const member of this.voiceChannel.members.array()) {
            if (member.user.bot || member.voice.deaf) continue;
            users.push(member.user);
        }
        return users;
    }
}