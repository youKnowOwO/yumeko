"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageEvent {
    constructor(client) {
        this.client = client;
        this.listener = "messageUpdate";
    }
    exec(oldMessage, newMessage) {
        if (oldMessage.content === newMessage.content)
            return undefined;
        this.client.collector.runner.handle(newMessage);
    }
}
exports.default = MessageEvent;
