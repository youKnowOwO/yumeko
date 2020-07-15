import { Client } from "discord.js";
import Logger from "./Logger";
import eventLoader from "./EventLoader";

// i don't want compiler compile these one
const config = require("../../config.json");

export default class YumekoClient extends Client {
    public config = config;
    public log = new Logger();
    public constructor() {
        super({
            fetchAllMembers: true,
            disableMentions: "everyone"
        });
        eventLoader(this);
    }
}