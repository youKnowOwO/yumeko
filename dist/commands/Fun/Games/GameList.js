"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
class GameListComamnd extends Command_1.default {
    constructor(client) {
        super(client, "game", {
            aliases: ["game", "mini-game"],
            description: {
                content: "See the list of mini game i had",
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
                    type: (_, content) => {
                        const list = this.collector.commands.filter(x => x.identifier.includes("game-"));
                        const command = list.find(x => x.option.description.adionalInfo.slice(1).includes(content.toLowerCase()));
                        if (!command)
                            throw new CustomError_1.default("!PARSING", "Mini game not found");
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
                msg.ctx.send("❕ **| Only one game per channel**");
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
                    > ${x.option.description.content}
                    *cmds: ${cmds.map(x => `\`${x}\``).join(", ")}*
                `;
        }).join("\n\n"))
            .setFooter(`To play a game type '${msg.prefix}game <game cmd>'`);
        return msg.ctx.send(embed);
    }
}
exports.default = GameListComamnd;
