import CustomError from "@yumeko/classes/CustomError";
import type { Message } from "discord.js";
import { Type } from "@yumeko/interfaces";
import { parseTime } from "@yumeko/util/Util";

export default class TypeTimespan implements Type {
    readonly name = "timespan";
    public exec(_: Message, content: string): number {
        const parsed = parseTime(content);
        if (isNaN(parsed)) throw new CustomError("!PARSING", "**Cannot determine that time position.**");
        return parsed;
    }
}