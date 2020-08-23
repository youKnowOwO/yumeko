import type { Track } from "lavalink";
import type { User } from "discord.js";
import { readableTime } from "@yumeko/util/Util";

export default class Song {
    public readonly track: string;
    public readonly identifier: string;
    public readonly isSeekable: boolean;
    public readonly author: string;
    public readonly length: number;
    public readonly isStream: boolean;
    public readonly position: number;
    public readonly title: string;
    public readonly uri: string;
    public constructor(track: Track, public readonly requester: User) {
        this.track = track.track;
        this.identifier = track.info.identifier;
        this.isSeekable = track.info.isSeekable;
        this.author = track.info.author;
        this.length = track.info.length;
        this.isStream = track.info.isStream;
        this.position = track.info.position;
        this.title = track.info.title;
        this.uri = track.info.uri;
    }

    public get thumbnail(): string {
        return `https://img.youtube.com/vi/${this.identifier}/hqdefault.jpg`;
    }

    public get readTime(): string {
        return readableTime(this.length);
    }
}