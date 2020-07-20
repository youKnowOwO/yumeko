import type YumekoClient from "../classes/Client";
import type { Message } from "discord.js";
import { Event } from "../interfaces";
import { handle } from "../util/CodeLinter";

export default class MessageEvent implements Event {
    public readonly listener = "message";
    public constructor(public readonly client: YumekoClient) {}
    public exec(msg: Message): void {
        this.client.collector.runner.handle(msg);
        handle(msg);
    }
}