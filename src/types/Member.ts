import CustomError from "../classes/CustomError";
import type { Message, GuildMember } from "discord.js";
import { Type } from "../interfaces";

const USER_PATTERN = /^(?:<@!?)?([0-9]+)>?$/;

export default class TypeMember implements Type {
    readonly name = "member";
    public exec(msg: Message, content: string): GuildMember {
        if (USER_PATTERN.test(content)) content = content.replace(USER_PATTERN, "$1");
        const members = msg.guild!.members.cache.filter(x => x.id === content ||
            x.displayName.toLowerCase().includes(content.toLowerCase()) ||
            x.user.username.toLowerCase().includes(content.toLowerCase()) ||
            x.user.tag.toLowerCase().includes(content.toLowerCase()));
        if (!members.size) throw new CustomError("!PARSING", "Cannot found member. Please insert right type!");
        const selected = members.find(x => x.displayName === content && x.user.username === content);
        if (!selected && members.size > 1) throw new CustomError("!PARSING", `Please more specify spelling member name. like: ${members.map(x => `\`${x.displayName}\``).join(", ")}`);
        return selected || members.first()!;
    }
}