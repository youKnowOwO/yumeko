import Command from "../../classes/Command";
import type { Message } from "discord.js";
import { stripIndents } from "common-tags";
import { DeclareCommand } from "../../decorators";

@DeclareCommand("about", {
    aliases: ["about"],
    description: {
        content: "About me.",
        usage: "about",
        examples: ["about"]
    },
    category: "general"
})
export default class AboutCommand extends Command {
    public async exec(msg: Message): Promise<Message> {
        const commands = this.collector!.commands.filter(x => !!x.option.aliases.length);
        return msg.ctx.send(stripIndents`
        👋 | Hi there, ${msg.author}! I’m **${this.client.user!.tag}** and I’m beyond happy and  glad to meet you! 
        I’m just an ordinary bot whose job is to make your Discord Server more fun and exciting
        for members to chat on. I do what other bots do as well, like: sending random images of animals, 
        generating games for this server’s members, and most importantly, I play and queue song requests. 
        To conclude, I carry \`${commands.filter(x => msg.author.isDev || !x.option.devOnly).size}\` commands in total. To test me out, 
        why not start by generating my help panel? **${this.client.config.prefix}help**.
        `);
    }
}