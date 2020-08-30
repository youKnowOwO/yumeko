import YumekoClient from "@yumeko/classes/Client";
import CustomError from "@yumeko/classes/CustomError";
import type { Message, User } from "discord.js";
import { Type } from "@yumeko/interfaces";

export default class TypeUserhuman implements Type {
    readonly name = "user:human";
    public exec(msg: Message, content: string): User {
        const userType = (msg.client as YumekoClient).collector.runner.argsParser.getType("user");
        const user: User = userType(msg, content) as any;
        if (user.bot) throw new CustomError("!PARSING", msg.guild!.loc.get("TYPE_HUMAN_BOT"));
        if (user.id === msg.author.id) throw new CustomError("!PARSING", msg.guild!.loc.get("TYPE_HUMAN_SELF"));
        return user;
    }
}