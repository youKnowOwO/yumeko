import type YumekoClient from "../classes/Client";
import * as linter from "../util/CodeLinter";
import * as myriad from "../util/Myriad";
import type { Message } from "discord.js";
import { Event } from "../interfaces";

export default class MessageEvent implements Event {
    public readonly listener = "message";
    public constructor(public readonly client: YumekoClient) {}
    public exec(msg: Message): void {
        this.client.collector.runner.handle(msg);
        linter.handle(msg);
        myriad.handle(msg);
        if (msg.guild && [`<@${this.client.user!.id}>`, `<@!${this.client.user!.id}>`].includes(msg.content))
            return this.client.collector.commands.get("about")!.exec(msg);
    }
}