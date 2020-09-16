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
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const decorators_1 = require("@yumeko/decorators");
let PingCommand = class PingCommand extends Command_1.default {
    async exec(msg) {
        const now = Date.now();
        const m = await msg.ctx.send("🏓 Ping..");
        const embed = new discord_js_1.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(common_tags_1.stripIndents `
                ⏱️ **RoundTrip:** \`${Math.round(Date.now() - now)}ms\`
                ⏳ **Latency:** \`${m.createdTimestamp - msg.createdTimestamp}ms\`
                💓 **API:** \`${this.client.ws.ping}ms\`
            `);
        return m.edit("🏓 Pong", embed);
    }
};
__decorate([
    decorators_1.constantly
], PingCommand.prototype, "exec", null);
PingCommand = __decorate([
    decorators_1.DeclareCommand("ping", {
        aliases: ["ping"],
        description: {
            content: "Ping pong",
            usage: "ping",
            examples: ["ping"]
        },
        permissions: {
            client: ["EMBED_LINKS"]
        },
        category: "general",
    })
], PingCommand);
exports.default = PingCommand;
