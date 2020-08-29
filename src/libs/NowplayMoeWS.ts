import WebSocket from "ws";
import { DataNowplayMoe } from "@yumeko/interfaces";

export class NowplayMoeWS {
    public constructor(public link: string) {}
    public ws?: WebSocket;
    public heartbeatInterval?: ReturnType<typeof setInterval>;
    public data?: DataNowplayMoe;

    public connect(): this {
        if (this.ws) this.ws.removeAllListeners();
        try {
            this.ws = new WebSocket(this.link);
        } catch {
            setTimeout(this.connect.bind(this), 5000);
            return this;
        }
        this.ws.on("open", this.onOpen.bind(this));
        this.ws.on("message", this.onMessage.bind(this));
        this.ws.on("close", this.onClose.bind(this));
        return this;
    }

    public onOpen (): void {
        clearInterval(this.heartbeatInterval!);
        this.ws!.send(JSON.stringify({ op: 0, d: { auth: "" } }));
    }

    public heartbeat(time: number): void {
        this.heartbeatInterval = setInterval(() =>
            this.ws!.send(JSON.stringify({ op: 9 })),
        time);
    }

    public onMessage(data: string): void {
        if (!data.length) return undefined;
        let result: any;
        try {
            result = JSON.parse(data);
        } catch {
            return undefined;
        }
        if (!result.op) return this.heartbeat(result.d.heartbeat);
        if (result.t !== "TRACK_UPDATE" && result.t !== "TRACK_UPDATE_REQUEST") return undefined;
        this.data = {
            title: result.d.song.title,
            artists: result.d.song.artists.length ? result.d.song.artists.map((x: any)=> `[${x.nameRomaji || x.name}](https://listen.moe/music/artists/${x.id})`).join(", ") : undefined,
            requester: result.d.requester ? `[${result.d.requester.displayName}](https://listen.moe/u/${result.d.requester.username})` : undefined,
            source: result.d.song.sources.length ? result.d.song.sources.map((x: any) => x.nameRomaji || x.name).join(", ") : undefined,
            albums: result.d.song.albums && result.d.song.albums.length ? result.d.song.albums.map((x: any) => `[${x.name}](https://listen.moe/music/albums/${x.id})`).join(", ") : undefined,
            cover: result.d.song.albums && result.d.song.albums.length && result.d.song.albums[0].image ? `https://cdn.listen.moe/covers/${result.d.song.albums[0].image}` : "https://listen.moe/images/share.jpg",
            listeners: result.d.listeners,
            event: result.d.event
        };
    }

    public onClose(): void {
        clearInterval(this.heartbeatInterval!);
        setTimeout(this.connect.bind(this), 5000);
    }
}

export default {
    jpop: new NowplayMoeWS("wss://listen.moe/gateway_v2").connect(),
    kpop: new NowplayMoeWS("wss://listen.moe/kpop/gateway_v2").connect()
};
