"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const discord_js_1 = require("discord.js");
const Util_1 = require("@yumeko/util/Util");
class BunnyCommand extends Command_1.default {
    constructor(client, animal = "bunny") {
        super(client, animal, {
            aliases: [animal],
            description: {
                content: `Random ${Util_1.firstUpperCase(animal)} image.`,
                usage: animal,
                examples: [animal]
            },
            permissions: {
                client: ["EMBED_LINKS"]
            },
            category: "animals",
        });
    }
    async exec(msg) {
        const image = await this.getImage();
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.config.color)
            .setURL(image)
            .setTitle("Click here if image failed to load")
            .setImage(image);
        return msg.ctx.send(embed);
    }
    async getImage() {
        const { body } = await node_superfetch_1.default.get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
        return body.media.gif;
    }
}
exports.default = BunnyCommand;
