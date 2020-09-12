import type YumekoClient from "@yumeko/classes/Client";
import { Event } from "@yumeko/interfaces";
import { stripIndents } from "common-tags";

const presences = require("../../assets/json/presence.json");

export default class ReadyEvent implements Event {
    public readonly listener = "ready";
    public constructor(public readonly client: YumekoClient) {}
    public async exec (): Promise<void> {
        await assignDB(this.client);
        this.client.log.info(stripIndents`
            ${this.client.log.color(this.client.user!.tag, "FFFFFF")} is Ready to play. ${this.client.shard ? this.client.shard.ids.map(x => this.client.log.color(`#${x + 1}`, "00FFFF")).join(", ") : ""}
        `);
        this.client.lavalink.userID = this.client.user!.id;
        presence.call(null, this.client);
        setInterval(presence.bind(null, this.client), 60000);
    }
}

function presence(client: YumekoClient): void {
    const { name, type, status } = presences[Math.round(Math.random()*presences.length)] || presences[0];
    client.user!.setPresence({
        status, activity: {
            name: name.replace(/\user/g, client.user!.username)
                .replace(/prefix/g, client.config.prefix)
                .replace(/listenmoe/g, client.nowplayMoe.jpop.data ? client.nowplayMoe.jpop.data.title : "LISTEN.moe")
                .replace(/shard:(id|count)/g, (_: string, type: string) => client.shard ? (type === "id" ? client.shard.ids.map(x => x + 1).join(", ") : client.shard.count) : 1),
            type
        }
    });
}

async function assignDB(client: YumekoClient): Promise<void> {
    await client.db.connect();
    const allGuild = client.shard ? await client.shard.broadcastEval("this.guilds.cache.keyArray()").then(x => (x as string[][]).flat()) : client.guilds.cache.keyArray();
    const values = await client.db.guild.all();
    for (const { key, value } of values) {
        const guild = client.guilds.cache.get(key);
        if (!allGuild.includes(key)) await client.db.guild.delete(key);
        if (!guild) continue;
        guild.assignDatabase(value);
    }
}