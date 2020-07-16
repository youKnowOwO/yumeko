import type { Message } from "discord.js";
import { Type } from "../interfaces";

export default class TypeBoolean implements Type {
    readonly name = "boolean";
    public exec(_: Message, content: string): boolean {
        return !!content.length;
    }
}