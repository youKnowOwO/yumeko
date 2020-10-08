import "module-alias/register";

import YumekoDatabase from "@yumeko/libs/Database";
import CommandCollector from "@yumeko/libs/CommandCollector";
import Context from "@yumeko/libs/MessageContext";
import Logger from "@yumeko/libs/Logger";
import eventLoader from "@yumeko/libs/EventLoader";
import nowPlayMoe from "@yumeko/libs/NowplayMoeWS";
import { langCollector } from "@yumeko/libs/Localization";
import { Config } from "@yumeko/interfaces";
import { Client } from "discord.js";
import { Node as Lavalink } from "lavalink";

import "../extension";
import { hide } from "@yumeko/decorators";

// i don't want compiler compile these one
const config: Config = require("../../config.json");

export default class YumekoClient extends Client {
    @hide
    public config = config;

    public collector = new CommandCollector(this);
    public context = new Context();
    public log = new Logger();
    public db = new YumekoDatabase();
    public lavalink = new Lavalink({
        userID: "",
        // eslint-disable-next-line @typescript-eslint/ban-types
        send: (guildID: string, packet: object): void => {
            const guild = this.guilds.cache.get(guildID);
            if (guild) return guild.shard.send(packet);
        },
        ...config.lavalink
    });

    public nowplayMoe = nowPlayMoe;
    public langs = langCollector();
    public constructor() {
        super({
            fetchAllMembers: true,
            allowedMentions: {
                parse: ["roles", "users"]
            }
        });
        eventLoader(this);
        this.collector.loadAll();
        this.on("error", this.log.error);
        this.on("warn", this.log.warn);
        this.lavalink.once("ready", () => this.log.info("Lavalink is ready to use"));
    }
}