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
const Util_1 = require("@yumeko/util/Util");
const Pagination_1 = __importDefault(require("@yumeko/util/Pagination"));
const decorators_1 = require("@yumeko/decorators");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg) {
        const { music } = msg.guild;
        await this.collector.commands.get("np").exec(msg);
        if (!music.queue.length)
            return msg;
        const pages = Util_1.chunk(music.queue.map((x, i) => `\`${i + 1}\`. __**[${x.title}](${x.uri})**__ **by** ${x.requester.toString()}`), 10)
            .map(x => x.join("\n"));
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.config.color);
        await new Pagination_1.default(msg, {
            pages, embed,
            edit: (i, emb, page) => emb.setDescription(page).setFooter(`Page ${i + 1} of ${pages.length}`)
        }).start();
    }
};
__decorate([
    decorators_1.constantly,
    decorators_1.isInStream(),
    decorators_1.isMusicPlaying()
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("queue", {
        aliases: ["queue", "nowplay"],
        description: {
            content: (msg) => msg.ctx.lang("COMMAND_MUSIC_QUEUE_DESCRIPTION"),
            usage: "queue",
            examples: ["queue"]
        },
        cooldown: 6,
        permissions: {
            client: ["EMBED_LINKS", "ADD_REACTIONS"]
        },
        category: "music",
    })
], default_1);
exports.default = default_1;
