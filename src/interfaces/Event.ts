import type Command from "@yumeko/classes/Command";
import type { ClientEvents } from "discord.js";

type EventKeys = keyof ClientEvents;

export interface Event {
    readonly listener: EventKeys;
    readonly devOnly?: boolean;
    exec(...args: ClientEvents[EventKeys]): any;
}

declare module "discord.js" {
    interface ClientEvents {
        raw: [any];
        commandStored: [Command?];
    }
}