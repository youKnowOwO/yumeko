import CustomError from "../classes/CustomError";
import type { Message } from "discord.js";
import { Type } from "../interfaces";

export default class TypeNumber implements Type {
    readonly name = "number";
    public exec(_: Message, content: string): number {
        const result = Number(content);
        if (isNaN(result)) throw new CustomError("!PARSING", `**\`${content}\` isn't even a number**`);
        return result;
    }
}