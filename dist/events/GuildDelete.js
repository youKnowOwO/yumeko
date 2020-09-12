"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GuildDeleteEvent {
    constructor(client) {
        this.client = client;
        this.listener = "guildDelete";
    }
    exec(guild) {
        this.client.db.guild.delete(guild.id);
    }
}
exports.default = GuildDeleteEvent;
