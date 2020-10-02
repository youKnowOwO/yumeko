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
const decorators_1 = require("@yumeko/decorators");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg, { title, text, image }) {
        const m = await msg.channel.send(msg.ctx.lang("COMMAND_FUN_PAINTING"));
        const { raw: attachment } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/demotivational")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ title, text, image });
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "demotivational.png" }] });
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("demotivational", {
        aliases: ["demotivational", "dmotivation", "dmtvtnl"],
        description: {
            content: (msg) => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_DEMOTIVATIONAL_DESCRIPTION"),
            usage: "demotivational <title> || <text> || [user|image]",
            examples: ["demotivational YOU CAN'T DO IT || BECAUSE YOU'RE SO USELESS"]
        },
        category: "fun",
        permissions: {
            client: ["ATTACH_FILES"]
        },
        splitBy: " || ",
        args: [
            {
                identifier: "title",
                match: "single",
                type: "string",
                prompt: (msg) => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_DEMOTIVATIONAL_PROMPT_1")
            },
            {
                identifier: "text",
                match: "single",
                type: "string",
                prompt: (msg) => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_DEMOTIVATIONAL_PROMPT_2")
            },
            {
                identifier: "image",
                match: "single",
                type: "image",
                default: (msg) => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
            }
        ]
    })
], default_1);
exports.default = default_1;
