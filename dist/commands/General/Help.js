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
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const Util_1 = require("@yumeko/util/Util");
const decorators_1 = require("@yumeko/decorators");
let HelpCommand = class HelpCommand extends Command_1.default {
    exec(msg, { command }) {
        if (command) {
            const { name: category } = this.collector.categories.find(x => x.type === command.option.category);
            const { option } = command;
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.client.config.color)
                .setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/twitter/31/black-question-mark-ornament_2753.png")
                .setDescription(common_tags_1.stripIndents `
                    __**${category} -> ${Util_1.firstUpperCase(command.identifier)}**__ ${option.disable ? "**[DISABLE]**" : ""}
                    ${Util_1.codeBlock("", option.description.content)}
                    **Usage:** \`${msg.prefix}${option.description.usage}\`
                    **Aliases:** ${option.aliases.length > 1 ? option.aliases.slice(1).map(x => `\`${x}\``).join(", ") : "`No Aliases`"}
                    **Cooldown:** \`${option.cooldown ? option.cooldown : 5} seconds\`
                `)
                .setFooter("ℹ️ Don't include <> or []. <> means required, and [] means optional.");
            if (option.description.examples.length)
                embed
                    .addField("Examples", Util_1.codeBlock("", option.description.examples.map(x => `${msg.prefix}${x}`).join("\n")));
            return msg.ctx.send(embed);
        }
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.config.color)
            .setFooter(`ℹ️ To learn more about a specific command, do ${msg.prefix}help <command name>`);
        for (const category of this.collector.categories) {
            let commands = msg.author.isDev ? category.commands : category.commands.filter(x => !x.option.devOnly);
            commands = commands.filter(x => x.option.aliases.length);
            if (!commands.length)
                continue;
            embed.addField(category.name, commands.map(x => `\`${x.identifier}\``).join(", "));
        }
        embed.fields = embed.fields.sort((a, b) => b.value.length - a.value.length);
        return msg.ctx.send(embed);
    }
};
HelpCommand = __decorate([
    decorators_1.DeclareCommand("help", {
        aliases: ["help", "h"],
        description: {
            content: "The first command you'll typing",
            usage: "help [command]",
            examples: ["help say"]
        },
        category: "general",
        permissions: {
            client: ["EMBED_LINKS"]
        },
        args: [
            {
                identifier: "command",
                type: "command",
                match: "single",
                optional: true
            }
        ]
    })
], HelpCommand);
exports.default = HelpCommand;
