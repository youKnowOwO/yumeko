import CommandCollector from "../libs/CommandCollector";
import Context from "../libs/MessageContext";
import Logger from "../libs/Logger";
import eventLoader from "../libs/EventLoader";
import { Client } from "discord.js";
import { Node as Lavalink } from "lavalink";

import "../extension";

// i don't want compiler compile these one
const config = require("../../config.json");

export default class YumekoClient extends Client {
    public collector = new CommandCollector(this);
    public context = new Context();
    public log = new Logger();
    public lavalink = new Lavalink({
        userID: "",
        // eslint-disable-next-line @typescript-eslint/ban-types
        send: (guildID: string, packet: object): void => {
            const guild = this.guilds.cache.get(guildID);
            if (guild) return guild.shard.send(packet);
        },
        ...config.lavalink
    });
    public config = config;
    public constructor() {
        super({
            fetchAllMembers: true,
            disableMentions: "everyone"
        });
        eventLoader(this);
        this.collector.loadAll();
        this.on("error", this.log.error);
        this.on("warn", this.log.warn);
        this.lavalink.once("ready", () => this.log.info("Lavalink is ready to use"));
    }
}