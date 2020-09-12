import type YumekoClient from "@yumeko/classes/Client";
import { Event } from "@yumeko/interfaces";
import type { Guild } from "discord.js";

export default class GuildDeleteEvent implements Event {
    public readonly listener = "guildDelete";
    public constructor(public readonly client: YumekoClient) {}
    public exec(guild: Guild): void {
        this.client.db.guild.delete(guild.id);
    }
}