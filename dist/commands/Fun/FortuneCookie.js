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
let default_1 = class default_1 extends Command_1.default {
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
        const base = await this.getCookieImage();
        return new canvas_constructor_1.Canvas(700, 500)
            .printImage(base, 0, 0)
            .translate(380, 335)
            .rotate(-13 * Math.PI / 180)
            .setTextFont("15px sans-serif")
            .printWrappedText(fortune, 0, 0, 300)
            .toBufferAsync();
    }
    async exec(msg) {
        const m = await msg.channel.send(msg.guild.loc.get("COMMAND_FUN_PAINTING"));
        const fortune = await this.getFortune();
        const attachment = await this.createImage(fortune);
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "fortune-cookie.jpg" }] });
    }
    async getCookieImage() {
        if (this.cookieImage)
            return this.cookieImage;
        const path = path_1.join(__dirname, "../../../assets/images/fortune-cookie.png");
        return this.cookieImage = await canvas_constructor_1.resolveImage(path);
    }
};
__decorate([
    decorators_1.hide
], default_1.prototype, "fortunes", void 0);
__decorate([
    decorators_1.hide
], default_1.prototype, "cookieImage", void 0);
__decorate([
    decorators_1.constantly
], default_1.prototype, "getFortune", null);
__decorate([
    decorators_1.constantly
], default_1.prototype, "createImage", null);
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("fortune-cookie", {
        aliases: ["fortune-cookie", "fortune"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_FORTUNE_COOKIE_DESCRIPTION"),
            usage: "fortune-cookie",
            examples: ["fortune-cookie"]
        },
        permissions: {
            client: ["ATTACH_FILES"]
        },
        category: "fun"
    })
], default_1);
exports.default = default_1;
