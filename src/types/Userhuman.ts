import YumekoClient from "../classes/Client";
import CustomError from "../classes/CustomError";
import type { Message, User } from "discord.js";
import { Type } from "../interfaces";

export default class TypeUserhuman implements Type {
    readonly name = "user:human";
    public exec(msg: Message, content: string): User {
        const userType = (msg.client as YumekoClient).collector.runner.argsParser.getType("user");
        const user: User = userType(msg, content) as any;
        if (user.bot) throw new CustomError("!PARSING", "**Bot not allowed!**");
        return user;
    }
}