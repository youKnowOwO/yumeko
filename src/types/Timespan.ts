import CustomError from "../classes/CustomError";
import type { Message } from "discord.js";
import { Type } from "../interfaces";
import { parseTime } from "../util/Util";

export default class TypeTimespan implements Type {
    readonly name = "timespan";
    public exec(_: Message, content: string): number {
        const parsed = parseTime(content);
        if (isNaN(parsed)) throw new CustomError("!PARSING", "**Cannot determine that time position.**");
        return parsed;
    }
}