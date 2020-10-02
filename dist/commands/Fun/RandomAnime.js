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
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg) {
        const response = await node_superfetch_1.default.get("https://emilia-api.xyz/api/random-anime")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`);
        const body = response.body;
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(body.name)
            .setColor(this.client.config.color)
            .setDescription(`> ${body.description}`)
            .setImage(body.image)
            .addField("\u200B", msg.ctx.lang("COMMAND_RANDOM_ANIME_PARSE_RESPONSE", body));
        if (body.alternate_name.length)
            embed.setTitle(body.alternate_name).setAuthor(body.name);
        const watchs = [];
        for (const key of Object.keys(body.watch)) {
            const platforms = body.watch[key].map(x => `[${x.platform}](${x.url})`).join(", ");
            watchs.push(`${key.toUpperCase()}: ${platforms}`);
        }
        embed.addField(msg.ctx.lang("COMMAND_RANDOM_ANIME_PARSE_WATCH"), watchs.join("\n"));
        return msg.ctx.send(embed);
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("random-anime", {
        aliases: ["random-anime"],
        description: {
            content: (msg) => msg.ctx.lang("COMMAND_RANDOM_ANIME_DESCRIPTION"),
            usage: "random-anime",
            examples: ["rabdom-anime"]
        },
        category: "fun"
    })
], default_1);
exports.default = default_1;
