"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const discord_js_1 = require("discord.js");
class InviteCommand extends Command_1.default {
    constructor(client) {
        super(client, "invite", {
            aliases: ["invite"],
            description: {
                content: "Invite the bot to your server",
                usage: "invite",
                examples: ["invite"]
            },
            permissions: {
                client: ["EMBED_LINKS"]
            },
            category: "general",
        });
    }
    async exec(msg) {
        const inviteUrl = await this.client.generateInvite(["ATTACH_FILES", "EMBED_LINKS", "CONNECT", "SPEAK", "ADD_REACTIONS", "SEND_MESSAGES", "MANAGE_MESSAGES"]);
        const embed = new discord_js_1.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`[Click here](${inviteUrl}) to invite me to your server!`);
        return msg.ctx.send(embed);
    }
}
exports.default = InviteCommand;
