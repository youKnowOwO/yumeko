import CustomError from "@yumeko/classes/CustomError";
import type { Message } from "discord.js";
import { Type } from "@yumeko/interfaces";
import { parseTime } from "@yumeko/util/Util";

export default class TypeTimespan implements Type {
    readonly name = "timespan";
    public exec(msg: Message, content: string): number {
        const parsed = parseTime(content);
        if (isNaN(parsed)) throw new CustomError("!PARSING", msg.guild!.loc.get("TYPE_TIMESPAN_NOT_FOUND"));
        return parsed;
    }
}