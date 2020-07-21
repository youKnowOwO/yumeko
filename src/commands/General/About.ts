import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import { Message } from "discord.js";
import { stripIndents } from "common-tags";

export default class AboutCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "about", {
            aliases: ["about"],
            description: {
                content: "About me.",
                usage: "about",
                examples: ["about"]
            },
            category: "general",
        });
    }

    public async exec(msg: Message): Promise<Message> {
        // INFO : Im bad speaking english someone pls send PR to fix my grammar/ anything
        return msg.ctx.send(stripIndents`
            👋 | Hello ${msg.author}, im **${this.client.user!.username}** nice to meet you.
            I just and ordinary bot who have \`${this.collector!.commands.filter(x => msg.author.isDev || !x.option.devOnly).size}\` commands!.
            You can start with **${this.client.config.prefix}help** for see the list commands i had.
            
            You can contribute too.
            https://github.com/youKnowOwO/yumeko-ts
        `);
    }
}