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
    async exec(msg, { text, image }) {
        const m = await msg.channel.send(msg.ctx.lang("COMMAND_FUN_PAINTING"));
        const { raw: attachment } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/achievement")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ text, image });
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "achievement.png" }] });
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("achievement", {
        aliases: ["achievement", "acvmnt"],
        description: {
            content: (msg) => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_ACHIEVEMENT_DESCRIPTION"),
            usage: "achievement <text> [--image=<image|user>]",
            examples: ["achievement"]
        },
        category: "fun",
        permissions: {
            client: ["ATTACH_FILES"]
        },
        args: [
            {
                identifier: "image",
                match: "flag",
                type: "image",
                flag: "image",
                default: (msg) => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
            },
            {
                identifier: "text",
                match: "rest",
                type: "string",
                prompt: (msg) => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_ACHIEVEMENT_PROMPT")
            }
        ]
    })
], default_1);
exports.default = default_1;
