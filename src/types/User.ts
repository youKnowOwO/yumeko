import YumekoClient from "@yumeko/classes/Client";
import type { Message, User } from "discord.js";
import { Type } from "@yumeko/interfaces";

export default class TypeUser implements Type {
    readonly name = "user";
    public exec(msg: Message, content: string): User {
        const memberType = (msg.client as YumekoClient).collector.runner.argsParser.getType("member");
        return (memberType(msg, content) as any).user;
    }
}