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
const canvas_constructor_1 = require("canvas-constructor");
const path_1 = require("path");
let FortuneCookieCommand = class FortuneCookieCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.fortunes = [];
    }
    async getFortune() {
        if (!this.fortunes.length)
            this.fortunes = await node_superfetch_1.default.get("https://raw.githubusercontent.com/dragonfire535/xiao/master/assets/json/fortune.json").then(x => JSON.parse(x.text));
        return this.fortunes[Math.floor(Math.random() * this.fortunes.length)];
    }
    async createImage(fortune) {
        const path = path_1.join(__dirname, "../../../assets/images/fortune-cookie.png");
        const base = await canvas_constructor_1.resolveImage(path);
        return new canvas_constructor_1.Canvas(700, 500)
            .printImage(base, 0, 0)
            .translate(380, 335)
            .rotate(-13 * Math.PI / 180)
            .setTextFont("15px sans-serif")
            .printWrappedText(fortune, 0, 0, 300)
            .toBufferAsync();
    }
    async exec(msg) {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const fortune = await this.getFortune();
        const attachment = await this.createImage(fortune);
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "fortune-cookie.jpg" }] });
    }
};
FortuneCookieCommand = __decorate([
    decorators_1.DeclareCommand("fortune-cookie", {
        aliases: ["fortune-cookie", "fortune"],
        description: {
            content: "crack your cookie and get the fortune.",
            usage: "fortune-cookie",
            examples: ["fortune-cookie"]
        },
        permissions: {
            client: ["ATTACH_FILES"]
        },
        category: "fun"
    })
], FortuneCookieCommand);
exports.default = FortuneCookieCommand;
