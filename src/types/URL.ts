import type { Message } from "discord.js";
import { Type } from "@yumeko/interfaces";
import CustomError from "@yumeko/classes/CustomError";

export default class TypeURL implements Type {
    readonly name = "url";
    public exec(_: Message, content: string): URL {
        try {
            return new URL(content);
        } catch {
            throw new CustomError("!PARSING", "Invalid URL");
        }
    }
}