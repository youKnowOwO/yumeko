import type YumekoClient from "../classes/Client";
import type { Message } from "discord.js";
import { Event } from "../interfaces";
import { handle } from "../util/CodeLinter";

export default class MessageEvent implements Event {
    public readonly listener = "messageUpdate";
    public constructor(public readonly client: YumekoClient) {}
    public exec(oldMessage: Message, newMessage: Message): void {
        if (oldMessage.content === newMessage.content) return undefined;
        this.client.collector.runner.handle(newMessage);
        handle(newMessage);
    }
}