import CustomError from "@yumeko/classes/CustomError";
import type { Message } from "discord.js";
import { Type, TypeCodeReturn } from "@yumeko/interfaces";

const CODEBLOCK_PATTERN = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i;

export default class TypeImage implements Type {
    readonly name = "code";
    public exec(msg: Message, content: string): TypeCodeReturn {
        const parsed = CODEBLOCK_PATTERN.exec(content);
        if (!parsed) throw new CustomError("!PARSING", msg.guild!.loc.get("TYPE_CODE_NOT_FOUND"));
        return {
            code: parsed[2],
            lang: parsed[1] ? parsed[1].toLowerCase() : undefined
        };
    }
}