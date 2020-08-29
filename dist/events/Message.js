"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageEvent {
    constructor(client) {
        this.client = client;
        this.listener = "message";
    }
    exec(msg) {
        this.client.collector.runner.handle(msg);
        if (msg.guild && !this.client.collector.runner.isCooldown(msg, false) && [`<@${this.client.user.id}>`, `<@!${this.client.user.id}>`].includes(msg.content))
            return this.client.collector.commands.get("about").exec(msg);
    }
}
exports.default = MessageEvent;
