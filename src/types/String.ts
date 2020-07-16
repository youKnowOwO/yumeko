import type { Message } from "discord.js";
import { Type } from "../interfaces";

export default class TypeString implements Type {
    readonly name = "string";
    public exec(_: Message, content: string): string {
        return content;
    }
}