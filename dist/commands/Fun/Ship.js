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
const decorators_1 = require("@yumeko/decorators");
const canvas_constructor_1 = require("canvas-constructor");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg, { userOne, userTwo }) {
        if (!userTwo) {
            userTwo = userOne;
            userOne = msg.author;
        }
        const m = await msg.channel.send(msg.ctx.lang("COMMAND_FUN_PAINTING"));
        const userOneAvatar = await canvas_constructor_1.resolveImage(userOne.displayAvatarURL({ format: "png", size: 512 }));
        const userTwoAvatar = await canvas_constructor_1.resolveImage(userTwo.displayAvatarURL({ format: "png", size: 512 }));
        const attachment = await new canvas_constructor_1.Canvas(1024, 524)
            .printImage(userOneAvatar, 0, 0, 512, 512)
            .printImage(userTwoAvatar, 512, 0, 512, 512)
            .toBufferAsync();
        m.delete();
        return msg.ctx.send(`❤️ **| ${this.getShipName(userOne.username, userTwo.username)} \`${Math.floor(Math.random() * 100)}%\`**`, { files: [{ attachment, name: "ship.png" }] });
    }
    getShipName(username1, username2) {
        return [this.getFirstPron(username1), this.getFirstPron(username2)].join("");
    }
    getFirstPron(letter) {
        const vocals = ["a", "i", "u", "e", "o"];
        let result = "";
        for (const wd of letter.split("")) {
            result += wd;
            if (vocals.includes(wd.toLocaleLowerCase()))
                break;
        }
        if (result !== letter)
            return result;
        return letter.substr(0, letter.length / 2);
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
__decorate([
    decorators_1.constantly
], default_1.prototype, "getShipName", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("ship", {
        aliases: ["ship"],
        description: {
            content: (msg) => msg.ctx.lang("COMMAND_SHIP_DESCRIPTION"),
            usage: "ship <user> [user] [shipname]",
            examples: ["ship @unknown"]
        },
        category: "fun",
        args: [
            {
                identifier: "userOne",
                match: "single",
                type: "user",
                prompt: (msg) => msg.ctx.lang("COMMAND_SHIP_PROMPT")
            },
            {
                identifier: "userTwo",
                match: "single",
                type: "user",
                optional: true
            },
            {
                identifier: "shipname",
                match: "rest",
                type: "string",
                optional: true
            }
        ]
    })
], default_1);
exports.default = default_1;
