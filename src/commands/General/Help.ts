import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import { Message,MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";
import { codeBlock, firstUpperCase } from "../../util/Util";

export default class HelpCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "help", {
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
        });
    }

    public exec(msg: Message, { command }: { command?: Command }): Promise<Message> {
        if(command) {
            const { name: category } = this.collector!.categories.find(x => x.type === command.option.category)!;
            const { option } = command;
            const embed = new MessageEmbed()
                .setColor(this.client.config.color)
                .setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/twitter/31/black-question-mark-ornament_2753.png")
                .setDescription(stripIndents`
                    __**${category} -> ${firstUpperCase(command.identifier)}**__ ${option.disable ? "**[DISABLE]**" : ""}
                    ${codeBlock("", option.description.content)}
                    **Usage:** \`${msg.prefix}${option.description.usage}\`
                    **Aliases:** ${option.aliases.length > 1 ? option.aliases.slice(1).map(x => `\`${x}\``).join(", ") : "`No Aliases`"}
                    **Cooldown:** \`${option.cooldown ? option.cooldown : 5} seconds\`
                `)
                .setFooter("ℹ️ Don't include <> or [], it's mean <> is required and [] is optional");
            if(option.description.examples.length) embed
                .addField("Examples", codeBlock("", option.description.examples.map(x => `${msg.prefix}${x}`).join("\n")));
            return msg.ctx.send(embed);
        }
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setFooter(`ℹ️ To get additional information use ${msg.prefix}help <command name>, <command name> to command what you want`);
        for(const category of this.collector!.categories) {
            let commands = msg.author.isDev ? category.commands : category.commands.filter(x => !x.option.devOnly);
            commands = commands.filter(x => x.option.aliases.length);
            if(!commands.length) continue;
            embed.addField(category.name, commands.map(x => `\`${x.identifier}\``).join(", "));
        }
        embed.fields = embed.fields.sort((a, b) => b.value.length - a.value.length);
        return msg.ctx.send(embed);
    }
}