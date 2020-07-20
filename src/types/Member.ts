import CustomError from "../classes/CustomError";
import type { Message, GuildMember } from "discord.js";
import { Type } from "../interfaces";

const USER_PATTERN = /^(?:<@!?)?([0-9]+)>?$/;

export default class TypeMember implements Type {
    readonly name = "member";
    public exec(msg: Message, content: string): GuildMember {
        if (USER_PATTERN.test(content)) content = content.replace(USER_PATTERN, "$1");
        content = content.toLowerCase();
        const members = msg.guild!.members.cache.filter(x => x.id === content ||
            x.displayName.toLowerCase().includes(content) ||
            x.user.username.toLowerCase().includes(content) ||
            x.user.tag.toLowerCase().includes(content));
        if (!members.size) throw new CustomError("!PARSING", "Cannot found member. Please insert right type!");
        if (members.size > 1) throw new CustomError("!PARSING", `Please more specify spelling member name. like: ${members.map(x => `\`${x.displayName}\``).join(", ")}`);
        return members.first()!;
    }
}