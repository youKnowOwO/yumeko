import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("about", {
    aliases: ["about"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_ABOUT_DESCRIPTION"),
        usage: "about",
        examples: ["about"]
    },
    category: "general"
})
export default class extends Command {
    @constantly
    public async exec(msg: Message): Promise<Message> {
        const commands = this.collector.commands.filter(x => !!x.option.aliases.length);
        return msg.ctx.send(msg.guild!.loc.get("COMMAND_ABOUT_ABOUTME", msg.author, this.client, commands, msg.prefix || msg.guild!.prefix));
    }
}