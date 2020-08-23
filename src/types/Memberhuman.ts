import YumekoClient from "@yumeko/classes/Client";
import CustomError from "@yumeko/classes/CustomError";
import type { Message, GuildMember } from "discord.js";
import { Type } from "@yumeko/interfaces";

export default class TypeMemberhuman implements Type {
    readonly name = "member:human";
    public exec(msg: Message, content: string): GuildMember {
        const memberType = (msg.client as YumekoClient).collector.runner.argsParser.getType("member");
        const member: GuildMember = memberType(msg, content) as any;
        if (member.user.bot) throw new CustomError("!PARSING", "**Bot not allowed!**");
        if (member.user.id === msg.author.id) throw new CustomError("!PARSING", "**You can't choose yourselft**");
        return member;
    }
}