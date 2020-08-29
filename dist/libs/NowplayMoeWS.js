"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NowplayMoeWS = void 0;
const ws_1 = __importDefault(require("ws"));
class NowplayMoeWS {
    constructor(link) {
        this.link = link;
    }
    connect() {
        if (this.ws)
            this.ws.removeAllListeners();
        try {
            this.ws = new ws_1.default(this.link);
        }
        catch {
            setTimeout(this.connect.bind(this), 5000);
            return this;
        }
        this.ws.on("open", this.onOpen.bind(this));
        this.ws.on("message", this.onMessage.bind(this));
        this.ws.on("close", this.onClose.bind(this));
        return this;
    }
    onOpen() {
        clearInterval(this.heartbeatInterval);
        this.ws.send(JSON.stringify({ op: 0, d: { auth: "" } }));
    }
    heartbeat(time) {
        this.heartbeatInterval = setInterval(() => this.ws.send(JSON.stringify({ op: 9 })), time);
    }
    onMessage(data) {
        if (!data.length)
            return undefined;
        let result;
        try {
            result = JSON.parse(data);
        }
        catch {
            return undefined;
        }
        if (!result.op)
            return this.heartbeat(result.d.heartbeat);
        if (result.t !== "TRACK_UPDATE" && result.t !== "TRACK_UPDATE_REQUEST")
            return undefined;
        this.data = {
            title: result.d.song.title,
            artists: result.d.song.artists.length ? result.d.song.artists.map((x) => `[${x.nameRomaji || x.name}](https://listen.moe/music/artists/${x.id})`).join(", ") : undefined,
            requester: result.d.requester ? `[${result.d.requester.displayName}](https://listen.moe/u/${result.d.requester.username})` : undefined,
            source: result.d.song.sources.length ? result.d.song.sources.map((x) => x.nameRomaji || x.name).join(", ") : undefined,
            albums: result.d.song.albums && result.d.song.albums.length ? result.d.song.albums.map((x) => `[${x.name}](https://listen.moe/music/albums/${x.id})`).join(", ") : undefined,
            cover: result.d.song.albums && result.d.song.albums.length && result.d.song.albums[0].image ? `https://cdn.listen.moe/covers/${result.d.song.albums[0].image}` : "https://listen.moe/images/share.jpg",
            listeners: result.d.listeners,
            event: result.d.event
        };
    }
    onClose() {
        clearInterval(this.heartbeatInterval);
        setTimeout(this.connect.bind(this), 5000);
    }
}
exports.NowplayMoeWS = NowplayMoeWS;
exports.default = {
    jpop: new NowplayMoeWS("wss://listen.moe/gateway_v2").connect(),
    kpop: new NowplayMoeWS("wss://listen.moe/kpop/gateway_v2").connect()
};
