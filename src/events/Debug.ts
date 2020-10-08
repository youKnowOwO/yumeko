import type YumekoClient from "@yumeko/classes/Client";
import { Event } from "@yumeko/interfaces";

export default class DebugEvent implements Event {
    public readonly listener = "debug";
    public readonly devOnly = true;
    public constructor(public readonly client: YumekoClient) {}
    public exec(msg: string): void {
        if (this.client.config.dev) {
            this.client.log.info(msg);
        }
    }
}

