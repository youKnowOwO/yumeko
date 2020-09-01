"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
class GameListCommand extends Command_1.default {
    constructor(client) {
        super(client, "game", {
            aliases: ["game", "mini-game"],
            description: {
                content: (msg) => msg.guild.loc.get("COMMAND_GAME_LIST_DESCRIPTION"),
                usage: "game [game]",
                examples: ["game gtn"]
            },
            category: "fun",
            permissions: {
                client: ["EMBED_LINKS"]
            },
            args: [
                {
                    identifier: "game",
                    match: "single",
                    optional: true,
                    type: (msg, content) => {
                        const list = this.collector.commands.filter(x => x.identifier.includes("game-"));
                        const command = list.find(x => x.option.description.adionalInfo.slice(1).includes(content.toLowerCase()));
                        if (!command)
                            throw new CustomError_1.default("!PARSING", msg.guild.loc.get("COMMAND_GAME_LIST_NOT_FOUND"));
                        return command;
                    }
                }
            ]
        });
        this.session = new Set();
    }
    async exec(msg, { game }) {
        if (game) {
            if (this.session.has(`${msg.channel.id}/${game.identifier}`)) {
                msg.ctx.send(msg.guild.loc.get("COMMAND_GAME_LIST_ONLY_ONE"));
                throw new CustomError_1.default("CANCELED");
            }
            this.session.add(`${msg.channel.id}/${game.identifier}`);
            await this.collector.runner.runCommand(msg, game);
            this.session.delete(`${msg.channel.id}/${game.identifier}`);
            return msg;
        }
        const list = this.collector.commands.filter(x => x.identifier.includes("game-"));
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.config.color)
            .setDescription(list.map(x => {
            const [name, ...cmds] = x.option.description.adionalInfo;
            return common_tags_1.stripIndents `
                    **${name}**
                    > ${typeof x.option.description.content === "string" ? x.option.description.content : x.option.description.content(msg)}
                    *cmds: ${cmds.map(x => `\`${x}\``).join(", ")}*
                `;
        }).join("\n\n"))
            .setFooter(msg.guild.loc.get("COMMAND_GAME_LIST_INFO", msg.prefix));
        return msg.ctx.send(embed);
    }
}
exports.default = GameListCommand;
