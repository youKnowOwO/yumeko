import type YumekoClient from "@yumeko/classes/Client";
import { Event } from "@yumeko/interfaces";

export default class DebugEvent implements Event {
    public readonly listener = "debug";
    public constructor(public readonly client: YumekoClient) {}
    public exec(msg: string): void {
        if (this.client.config.debug) {
            this.client.log.info(msg);
        }
    }
}