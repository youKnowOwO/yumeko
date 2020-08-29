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
const common_tags_1 = require("common-tags");
const decorators_1 = require("@yumeko/decorators");
let AboutCommand = class AboutCommand extends Command_1.default {
    async exec(msg) {
        const commands = this.collector.commands.filter(x => !!x.option.aliases.length);
        return msg.ctx.send(common_tags_1.stripIndents `
        👋 | Hi there, ${msg.author}! I’m **${this.client.user.tag}** and I’m beyond happy and  glad to meet you! 
        I’m just an ordinary bot whose job is to make your Discord Server more fun and exciting
        for members to chat on. I do what other bots do as well, like: sending random images of animals, 
        generating games for this server’s members, and most importantly, I play and queue song requests. 
        To conclude, I carry \`${commands.filter(x => msg.author.isDev || !x.option.devOnly).size}\` commands in total. To test me out, 
        why not start by generating my help panel? **${this.client.config.prefix}help**.
        `);
    }
};
AboutCommand = __decorate([
    decorators_1.DeclareCommand("about", {
        aliases: ["about"],
        description: {
            content: "About me.",
            usage: "about",
            examples: ["about"]
        },
        category: "general"
    })
], AboutCommand);
exports.default = AboutCommand;
