"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class MessageContext {
    constructor(lifeTime = 60000) {
        this.lifeTime = lifeTime;
        this.cache = new discord_js_1.Collection();
    }
    async send(msg, content, options) {
        let message = this.cache.get(msg.id);
        if (!message) {
            message = await msg.channel.send(content, options);
            this.cache.set(msg.id, message);
            setTimeout(() => this.cache.delete(msg.id), this.lifeTime);
        }
        else {
            let toCheck = options;
            if (typeof content === "object")
                toCheck = content;
            if (toCheck && toCheck.files instanceof Array && toCheck.files.length) {
                await msg.channel.send(content, options);
                this.cache.set(msg.id, message);
            }
            else
                message.edit(content, options);
        }
        return message;
    }
}
exports.default = MessageContext;
