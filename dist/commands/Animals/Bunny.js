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
const en_US_1 = require("@yumeko/langs/en_US");
const decorators_1 = require("@yumeko/decorators");
class default_1 extends Command_1.default {
    constructor(client, animal = "bunny") {
        super(client, animal, {
            aliases: [animal],
            description: {
                content: (msg) => msg.ctx.lang("COMMAND_ANIMAL_DESCRIPTION", en_US_1.Animals[animal]),
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
            .setTitle(msg.ctx.lang("COMMAND_ANIMAL_CLICK_HERE"))
            .setImage(image);
        return msg.ctx.send(embed);
    }
    async getImage() {
        const { body } = await node_superfetch_1.default.get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
        return body.media.gif;
    }
}
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
__decorate([
    decorators_1.constantly
], default_1.prototype, "getImage", null);
exports.default = default_1;
