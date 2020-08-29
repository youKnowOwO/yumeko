"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const CommandCollector_1 = __importDefault(require("@yumeko/libs/CommandCollector"));
const MessageContext_1 = __importDefault(require("@yumeko/libs/MessageContext"));
const Logger_1 = __importDefault(require("@yumeko/libs/Logger"));
const EventLoader_1 = __importDefault(require("@yumeko/libs/EventLoader"));
const NowplayMoeWS_1 = __importDefault(require("@yumeko/libs/NowplayMoeWS"));
const discord_js_1 = require("discord.js");
const lavalink_1 = require("lavalink");
require("../extension");
const config = require("../../config.json");
class YumekoClient extends discord_js_1.Client {
    constructor() {
        super({
            fetchAllMembers: true,
            disableMentions: "everyone"
        });
        this.collector = new CommandCollector_1.default(this);
        this.context = new MessageContext_1.default();
        this.log = new Logger_1.default();
        this.lavalink = new lavalink_1.Node({
            userID: "",
            send: (guildID, packet) => {
                const guild = this.guilds.cache.get(guildID);
                if (guild)
                    return guild.shard.send(packet);
            },
            ...config.lavalink
        });
        this.nowplayMoe = NowplayMoeWS_1.default;
        this.config = config;
        EventLoader_1.default(this);
        this.collector.loadAll();
        this.on("error", this.log.error);
        this.on("warn", this.log.warn);
        this.lavalink.once("ready", () => this.log.info("Lavalink is ready to use"));
    }
}
exports.default = YumekoClient;
