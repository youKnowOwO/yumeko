import CustomError from "@yumeko/classes/CustomError";
import type { Message } from "discord.js";
import { Type } from "@yumeko/interfaces";
import { constantly } from "@yumeko/decorators";

export default class TypeNumber implements Type {
    readonly name = "number";

    @constantly
    public exec(msg: Message, content: string): number {
        const result = Number(content);
        if (isNaN(result)) throw new CustomError("!PARSING", msg.ctx.lang("TYPE_NUMBER_NOT_FOUND", content));
        return result;
    }
}