"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RawEvent {
    constructor(client) {
        this.client = client;
        this.listener = "raw";
    }
    exec(packet) {
        switch (packet.t) {
            case "VOICE_STATE_UPDATE":
                this.client.lavalink.voiceStateUpdate(packet.d);
                break;
            case "VOICE_SERVER_UPDATE":
                this.client.lavalink.voiceServerUpdate(packet.d);
                break;
        }
    }
}
exports.default = RawEvent;
