import CustomError from "@yumeko/classes/CustomError";
import type { Message, GuildMember } from "discord.js";
import { Type } from "@yumeko/interfaces";

const USER_PATTERN = /^(?:<@!?)?([0-9]+)>?$/;

export default class TypeMember implements Type {
    readonly name = "member";
    public exec(msg: Message, content: string): GuildMember {
        if (USER_PATTERN.test(content)) content = content.replace(USER_PATTERN, "$1");
        const members = msg.guild!.members.cache.filter(x => x.id === content ||
            x.displayName.toLowerCase().includes(content.toLowerCase()) ||
            x.user.username.toLowerCase().includes(content.toLowerCase()) ||
            x.user.tag.toLowerCase().includes(content.toLowerCase()));
        if (!members.size) throw new CustomError("!PARSING", msg.guild!.loc.get("TYPE_MEMBER_NOT_FOUND"));
        const selected = members.find(x => x.displayName === content && x.user.username === content);
        const list = members.map(x => `\`${x.displayName}\``).join(", ");
        if (!selected && members.size > 1) throw new CustomError("!PARSING", msg.guild!.loc.get("TYPE_MEMBER_HAS_SIMILIAR", list));
        return selected || members.first()!;
    }
}