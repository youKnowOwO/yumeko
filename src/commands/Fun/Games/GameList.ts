import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import CustomError from "@yumeko/classes/CustomError";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";

export default class GameListCommand extends Command {
    public session: Set<string> = new Set();
    public constructor (client: YumekoClient) {
        super(client, "game", {
            aliases: ["game", "mini-game"],
            description: {
                content: (msg): string => msg.guild!.loc.get("COMMAND_GAME_LIST_DESCRIPTION"),
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
                    type: (msg: Message, content: string): Command => {
                        const list = this.collector.commands.filter(x => x.identifier.includes("game-"));
                        const command = list.find(x => x.option.description.adionalInfo!.slice(1).includes(content.toLowerCase()));
                        if (!command) throw new CustomError("!PARSING", msg.guild!.loc.get("COMMAND_GAME_LIST_NOT_FOUND"));
                        return command;
                    }
                }
            ]
        });
    }

    public async exec(msg: Message, { game } : { game?: Command }): Promise<Message> {
        if (game) {
            if (this.session.has(`${msg.channel.id}/${game.identifier}`)) {
                msg.ctx.send(msg.guild!.loc.get("COMMAND_GAME_LIST_ONLY_ONE"));
                throw new CustomError("CANCELED");
            }
            this.session.add(`${msg.channel.id}/${game.identifier}`);
            await this.collector.runner.runCommand(msg, game);
            this.session.delete(`${msg.channel.id}/${game.identifier}`);
            return msg;
        }
        const list = this.collector.commands.filter(x => x.identifier.includes("game-"));
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setDescription(list.map(x => {
                const [name, ...cmds] = x.option.description.adionalInfo!;
                return stripIndents`
                    **${name}**
                    > ${typeof x.option.description.content === "string" ? x.option.description.content : x.option.description.content(msg)}
                    *cmds: ${cmds.map(x => `\`${x}\``).join(", ")}*
                `;
            }).join("\n\n"))
            .setFooter(msg.guild!.loc.get("COMMAND_GAME_LIST_INFO", msg.prefix!));
        return msg.ctx.send(embed);
    }
}