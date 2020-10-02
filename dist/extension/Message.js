"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class YumekoMessage extends discord_js_1.Structures.get("Message") {
    constructor() {
        super(...arguments);
        this.args = [];
        this.ctx = {
            send: (content, options) => this.client.context.send(this, content, options),
            lang: (key, ...args) => this.client.context.lang(this, key, ...args)
        };
    }
}
discord_js_1.Structures.extend("Message", () => YumekoMessage);
