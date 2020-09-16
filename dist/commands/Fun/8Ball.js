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
const eightBallResponse = require("../../../assets/json/8ball.json");
let EightBallCommand = class EightBallCommand extends Command_1.default {
    exec(msg) {
        const responses = eightBallResponse[msg.guild.loc.lang] || eightBallResponse.en_US;
        const response = responses[Math.round(Math.random() * responses.length)] || responses[0];
        return msg.ctx.send(`🎱 **| ${response}**`);
    }
};
__decorate([
    decorators_1.constantly
], EightBallCommand.prototype, "exec", null);
EightBallCommand = __decorate([
    decorators_1.DeclareCommand("8ball", {
        aliases: ["8ball"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_8BALL_DESCRIPTION"),
            usage: "8ball <question>",
            examples: ["8ball are you right ?"]
        },
        category: "fun",
        args: [
            {
                identifier: "text",
                match: "rest",
                prompt: (msg) => msg.guild.loc.get("COMMAND_8BALL_PROMPT"),
                type: "string"
            }
        ]
    })
], EightBallCommand);
exports.default = EightBallCommand;
