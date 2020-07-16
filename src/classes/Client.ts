import { Client } from "discord.js";
import CommandCollector from "../libs/CommandCollector";
import Logger from "../libs/Logger";
import eventLoader from "../libs/EventLoader";

import "../extension";

// i don't want compiler compile these one
const config = require("../../config.json");

export default class YumekoClient extends Client {
    public collector = new CommandCollector(this);
    public config = config;
    public log = new Logger();
    public constructor() {
        super({
            fetchAllMembers: true,
            disableMentions: "everyone"
        });
        eventLoader(this);
        this.collector.loadAll();
    }
}