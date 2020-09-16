import type { Message } from "discord.js";
import { Type } from "@yumeko/interfaces";
import { constantly } from "@yumeko/decorators";

export default class TypeString implements Type {
    readonly name = "string";

    @constantly
    public exec(_: Message, content: string): string {
        return content;
    }
}