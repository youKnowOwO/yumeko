import CustomError from "@yumeko/classes/CustomError";
import type { Message } from "discord.js";
import { Type } from "@yumeko/interfaces";

export default class TypeNumber implements Type {
    readonly name = "number";
    public exec(msg: Message, content: string): number {
        const result = Number(content);
        if (isNaN(result)) throw new CustomError("!PARSING", msg.guild!.loc.get("TYPE_NUMBER_NOT_FOUND", content));
        return result;
    }
}