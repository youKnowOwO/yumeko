import type YumekoClient from "@yumeko/classes/Client";
import type Command from "@yumeko/classes/Command";
import CustomError from "@yumeko/classes/CustomError";
import type { Message } from "discord.js";
import { Type } from "@yumeko/interfaces";

export default class TypeCommand implements Type {
    readonly name = "command";
    public exec(msg: Message, content: string): Command {
        let { commands } = (msg.client as YumekoClient).collector;
        if (!msg.author.isDev) commands = commands.filter(x => !x.option.devOnly);
        const command = commands.filter(x => x.option.aliases.includes(content.toLowerCase())).first();
        if (!command) {
            const similiar = commands.map(x => x.option.aliases).reduce((a, b) => a.concat(b))
                .filter(x => x.includes(content.toLowerCase()))
                .splice(0, 10)
                .map(x => x.replace(content.toLowerCase(), `**${content.toLowerCase()}**`))
                .join(", ");
            throw new CustomError("!PARSING", `**\`${content}\` isn't exist.** ${similiar.length ? `Did you mean one of thess ? ${similiar}` : ""}`);
        }
        return command;
    }
}