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
const decorators_1 = require("@yumeko/decorators");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg) {
        const inviteUrl = await this.client.generateInvite(["ATTACH_FILES", "EMBED_LINKS", "CONNECT", "SPEAK", "ADD_REACTIONS", "SEND_MESSAGES", "MANAGE_MESSAGES"]);
        const embed = new discord_js_1.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(msg.ctx.lang("COMMAND_INVITE_CLICK_HRER", inviteUrl));
        return msg.ctx.send(embed);
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("invite", {
        aliases: ["invite"],
        description: {
            content: (msg) => msg.ctx.lang("COMMAND_INVITE_DESCRIPTION"),
            usage: "invite",
            examples: ["invite"]
        },
        permissions: {
            client: ["EMBED_LINKS"]
        },
        category: "general",
    })
], default_1);
exports.default = default_1;
