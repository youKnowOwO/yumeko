"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DebugEvent {
    constructor(client) {
        this.client = client;
        this.listener = "debug";
    }
    exec(msg) {
        if (this.client.config.debug) {
            this.client.log.info(msg);
        }
    }
}
exports.default = DebugEvent;
