import type YumekoClient from "../classes/Client";
import { Event } from "../interfaces";
import { stripIndents } from "common-tags";

const presences = require("../../assets/json/presence.json");

export default class ReadyEvent implements Event {
    public listener = "ready";
    public constructor(public readonly client: YumekoClient) {}
    public exec (): void {
        this.client.log.info(stripIndents`
            ${this.client.log.color(this.client.user!.tag, "FFFFFF")} is Ready to play.
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
                .replace(/prefix/g, client.config.prefix),
            type
        }
    });
}