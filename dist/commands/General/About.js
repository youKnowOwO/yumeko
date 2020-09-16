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
let AboutCommand = class AboutCommand extends Command_1.default {
    async exec(msg) {
        const commands = this.collector.commands.filter(x => !!x.option.aliases.length);
        return msg.ctx.send(msg.guild.loc.get("COMMAND_ABOUT_ABOUTME", msg.author, this.client, commands, msg.prefix || msg.guild.prefix));
    }
};
__decorate([
    decorators_1.constantly
], AboutCommand.prototype, "exec", null);
AboutCommand = __decorate([
    decorators_1.DeclareCommand("about", {
        aliases: ["about"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_ABOUT_DESCRIPTION"),
            usage: "about",
            examples: ["about"]
        },
        category: "general"
    })
], AboutCommand);
exports.default = AboutCommand;
