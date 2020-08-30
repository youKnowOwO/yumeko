import Command from "@yumeko/classes/Command";
import { Message,MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";
import { codeBlock, firstUpperCase } from "@yumeko/util/Util";
import { DeclareCommand } from "@yumeko/decorators";

@DeclareCommand("help", {
    aliases: ["help", "h"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_HELP_DESCRIPTION"),
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
export default class HelpCommand extends Command {
    public exec(msg: Message, { command }: { command?: Command }): Promise<Message> {
        if (command) {
            const { name: category } = this.collector!.categories.find(x => x.type === command.option.category)!;
            const { option } = command;
            const desc: [string, string[], number] = [
                `${msg.prefix}${option.description.usage}`,
                option.aliases.length > 1 ? option.aliases.slice(1) : ["No Aliases"],
                option.cooldown ? option.cooldown : 5
            ];
            const embed = new MessageEmbed()
                .setColor(this.client.config.color)
                .setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/twitter/31/black-question-mark-ornament_2753.png")
                .setDescription(stripIndents`
                    __**${category} -> ${firstUpperCase(command.identifier)}**__ ${option.disable ? "**[DISABLE]**" : ""}
                    ${codeBlock("", typeof option.description.content === "string" ? option.description.content : option.description.content(msg))}
                    ${msg.guild!.loc.get("COMMAND_HELP_PARSE_DESC", ...desc)}
                `)
                .setFooter(msg.guild!.loc.get("COMMAND_HELP_INFO_ARGS"));
            if (option.description.examples.length) embed
                .addField(msg.guild!.loc.get("COMMAND_HELP_PARSE_EXAMPLES"), codeBlock("", option.description.examples.map(x => `${msg.prefix}${x}`).join("\n")));
            return msg.ctx.send(embed);
        }
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setFooter(msg.guild!.loc.get("COMMAND_HELP_INFO_EXPLAIN", msg.prefix!));
        for (const category of this.collector!.categories) {
            let commands = msg.author.isDev ? category.commands : category.commands.filter(x => !x.option.devOnly);
            commands = commands.filter(x => x.option.aliases.length);
            if (!commands.length) continue;
            embed.addField(category.name, commands.map(x => `\`${x.identifier}\``).join(", "));
        }
        embed.fields = embed.fields.sort((a, b) => b.value.length - a.value.length);
        return msg.ctx.send(embed);
    }
}