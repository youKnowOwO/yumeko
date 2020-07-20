import type { ClientEvents } from "discord.js";

export interface YumekoClientEvents extends ClientEvents {
    raw: [any];
}

export interface Event {
    readonly listener: keyof YumekoClientEvents;
    exec(...args: YumekoClientEvents[Event["listener"]]): any;
}