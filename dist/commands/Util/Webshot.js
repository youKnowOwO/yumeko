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
let WebshotCommand = class WebshotCommand extends Command_1.default {
    async exec(msg, { url }) {
        const m = await msg.channel.send("📸 **| Capturing**");
        const { raw } = await node_superfetch_1.default.get(`https://image.thum.io/get/width/1920/crop/675/noanimate/${url}`);
        m.delete();
        return msg.ctx.send({ files: [{ attachment: raw, name: "webshot.jpg" }] });
    }
};
WebshotCommand = __decorate([
    decorators_1.DeclareCommand("webshot", {
        aliases: ["webshot", "web-screenshot", "web-capture"],
        description: {
            content: "Screenshot some site",
            usage: "webshot <url>",
            examples: ["webshot https://google.com"]
        },
        permissions: {
            client: ["ATTACH_FILES"]
        },
        category: "utility",
        nsfw: true,
        args: [
            {
                identifier: "url",
                match: "rest",
                type: "url",
                prompt: "Which site do you want to capture ?"
            }
        ]
    })
], WebshotCommand);
exports.default = WebshotCommand;
