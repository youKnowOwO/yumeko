import type Client from "../classes/Client";
import { Event } from "../interfaces";
import { stripIndents } from "common-tags";

export default class ReadyEvent implements Event {
    public listener = "ready";
    public once = true;
    public constructor(public readonly client: Client) {}
    public exec (): void {
        this.client.log.info(stripIndents`
            ${this.client.log.color(this.client.user!.tag, "FFFFFF")} is Ready to play.
        `);
    }
}