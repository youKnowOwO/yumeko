"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("@yumeko/util/Util");
class Song {
    constructor(track, requester) {
        this.requester = requester;
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
    get thumbnail() {
        return `https://img.youtube.com/vi/${this.identifier}/hqdefault.jpg`;
    }
    get readTime() {
        return Util_1.readableTime(this.length);
    }
}
exports.default = Song;
