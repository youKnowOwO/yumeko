import type { Message } from "discord.js";
import { Type } from "@yumeko/interfaces";
import { constantly } from "@yumeko/decorators";

export default class TypeBoolean implements Type {
    readonly name = "boolean";

    @constantly
    public exec(_: Message, content: string): boolean {
        return !!content.length;
    }
}