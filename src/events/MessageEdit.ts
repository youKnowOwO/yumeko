import type YumekoClient from "../classes/Client";
import * as linter from "../util/CodeLinter";
import * as myriad from "../util/Myriad";
import type { Message } from "discord.js";
import { Event } from "../interfaces";

export default class MessageEvent implements Event {
    public readonly listener = "messageUpdate";
    public constructor(public readonly client: YumekoClient) {}
    public exec(oldMessage: Message, newMessage: Message): void {
        if (oldMessage.content === newMessage.content) return undefined;
        this.client.collector.runner.handle(newMessage);
        linter.handle(newMessage);
        myriad.handle(newMessage);
    }
}