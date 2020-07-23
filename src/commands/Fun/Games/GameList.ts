import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import CustomError from "../../../classes/CustomError";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";

export default class GameListComamnd extends Command {
    public session: Set<string> = new Set();
    public constructor (client: YumekoClient) {
        super(client, "game", {
            aliases: ["game", "mini-game"],
            description: {
                content: "See the list of mini game i had",
                usage: "game [game]",
                examples: ["game Guess The Number"]
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
                    type: (_: Message, content: string): Command => {
                        const list = this.collector!.commands.filter(x => x.identifier.includes("game-"));
                        const command = list.find(x => x.option.description.adionalInfo!.slice(1).includes(content.toLowerCase()));
                        if (!command) throw new CustomError("!PARSING", "Mini game not found");
                        return command;
                    }
                }
            ]
        });
    }

    public async exec(msg: Message, { game } : { game: Command }): Promise<Message> {
        if (game) {
            if (this.session.has(`${msg.channel.id}/${game.identifier}`)) {
                msg.ctx.send("❕ **| Only one game oer user**");
                throw new CustomError("CANCELED");
            }
            this.session.add(`${msg.channel.id}/${game.identifier}`);
            await this.collector!.runner.runCommand(msg, game);
            this.session.delete(`${msg.channel.id}/${game.identifier}`);
            return msg;
        }
        const list = this.collector!.commands.filter(x => x.identifier.includes("game-"));
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setDescription(list.map(x => {
                const [name, ...cmds] = x.option.description.adionalInfo!;
                return stripIndents`
                    **${name}**
                    ${x.option.description.content.replace(/\n/g, "\n> ")}
                    *cmds: ${cmds.map(x => `\`${x}\``).join(", ")}*
                `;
            }).join("\n"));
        return msg.ctx.send(embed);
    }
}