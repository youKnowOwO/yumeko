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
const path_1 = require("path");
let BananaCommand = class BananaCommand extends Command_1.default {
    async exec(msg, { member }) {
        if (!member)
            member = msg.member;
        const length = Math.floor(Math.random() * 15) + 5;
        const attachment = await this.makeImage(length);
        return msg.ctx.send(`🍌 **| \`${member.displayName}\` banana length is \`${length}cm\`**`, { files: [{ attachment, name: "banana.jpg" }] });
    }
    async makeImage(length) {
        const path = path_1.join(__dirname, "../../../assets/images/banana.png");
        const base = await canvas_constructor_1.resolveImage(path);
        const diff = length / 20;
        const bananaImage = await canvas_constructor_1.resolveImage(await new canvas_constructor_1.Canvas(500, 333).printImage(base, 0, 0).toBufferAsync());
        return new canvas_constructor_1.Canvas(500, 353)
            .printImage(base, 0, 0)
            .setColor("white")
            .printRectangle(0, 0, 500, 333)
            .printImage(bananaImage, 500 - (500 * diff), 333 - (333 * diff), 500 * diff, 333 * diff)
            .toBufferAsync();
    }
};
BananaCommand = __decorate([
    decorators_1.DeclareCommand("banana", {
        aliases: ["banana", "banana-length"],
        description: {
            content: "See user banana length",
            usage: "banana [user]",
            examples: ["banana", "banana @unknown"]
        },
        category: "fun",
        args: [
            {
                identifier: "user",
                match: "rest",
                type: "member",
                optional: true
            }
        ]
    })
], BananaCommand);
exports.default = BananaCommand;
