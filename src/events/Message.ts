import type YumekoClient from "../classes/Client";
import type { Message } from "discord.js";
import { Event } from "../interfaces";

export default class ReadyEvent implements Event {
    public listener = "message";
    public constructor(public readonly client: YumekoClient) {}
    public exec(msg: Message): void {
        this.client.collector.runner.handle(msg);
    }
}