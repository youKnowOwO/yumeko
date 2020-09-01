"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const moment_1 = __importDefault(require("moment"));
const decorators_1 = require("@yumeko/decorators");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const Util_1 = require("@yumeko/util/Util");
const os_1 = require("os");
let StatsCommand = class StatsCommand extends Command_1.default {
    async exec(msg) {
        const [usersSize, channelsSize, serversSize] = this.client.shard ?
            this.parseSizeEvaluate(await this.client.shard.broadcastEval(`[
                this.users.cache.map(x => x.id),
                this.channels.cache.size,
                this.guilds.cache.size
            ]`)) : [this.client.users.cache.size, this.client.channels.cache.size, this.client.guilds.cache.size];
        const usage = process.memoryUsage();
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.config.color)
            .setTitle("♪ My Current Statistic")
            .setThumbnail(this.client.user.displayAvatarURL())
            .setDescription(Util_1.codeBlock("ascii", common_tags_1.stripIndents `
                Shard          : ${Number(msg.guild.shardID) + 1} / ${this.client.shard ? this.client.shard.count : 1}
                Memory Usage   : ${(usage.heapUsed / 1024 / 1024).toFixed(2)} / ${Math.round(100 * (usage.heapTotal / 1048576)) / 100} MB
                Uptime         : ${moment_1.default.duration(this.client.uptime).format("YY [years] MM [month] DD [days], hh:mm:ss")}
                CPU            : ${Math.round(os_1.loadavg()[0] * 100) / 100}%
                Users          : ${usersSize.toLocaleString()}
                Channels       : ${channelsSize.toLocaleString()}
                Servers        : ${serversSize.toLocaleString()}
                WS ping        : ${this.client.ws.ping.toFixed(2)}ms
                Node           : ${process.version}
            `));
        const owners = [];
        for (const own of this.client.config.owners) {
            const owner = this.client.users.cache.get(own) || await this.client.users.fetch(own, true).catch(() => undefined);
            if (!owner)
                continue;
            owners.push(`• ${msg.guild.members.cache.has(owner.id) ? owner : owner.username} (${owner.id})`);
        }
        embed.addField("📌 Owners", owners.join("\n"))
            .addField("\u200B", "[Github](https://github.com/youKnowOwO) | [Repository](https://github.com/youKnowOwO/yumeko)");
        return msg.ctx.send(embed);
    }
    parseSizeEvaluate(data) {
        const result = [0, 0, 0];
        const users = [];
        for (const dat of data)
            for (let i = 0; i < 3; i++) {
                if (i === 0) {
                    users.push(...dat[i]);
                }
                else
                    result[i] += dat[i];
            }
        result[0] = new Set(users).size;
        return result;
    }
};
StatsCommand = __decorate([
    decorators_1.DeclareCommand("stats", {
        aliases: ["stats"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_STATS_DESCRIPTION"),
            usage: "stats",
            examples: ["stats"]
        },
        permissions: {
            client: ["EMBED_LINKS"]
        },
        category: "general",
    })
], StatsCommand);
exports.default = StatsCommand;
