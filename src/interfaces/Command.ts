import type { PermissionString, Message } from "discord.js";
import type Command from "@yumeko/classes/Command";

export interface CommandOption {
    description: {
        content: string | ((msg: Message) => string);
        usage: string;
        examples: string[];
        adionalInfo?: string[];
    };
    permissions?: {
        client?: PermissionString[];
        user?: PermissionString[];
    };
    category: string;
    aliases: string[];
    cooldown?: number;
    disable?: boolean;
    devOnly?: boolean;
    nsfw?: boolean;
    splitBy?: string|RegExp;
    args?: Argument[];
}

export interface CommandCollectorCategories {
    type: CommandOption["category"];
    name: string;
    commands: Command[];
}

export interface CommandUsed {
    running: boolean;
    since: number;
    amount: number;
    timeout?: unknown;
}

export type TypeFunction = (msg: Message, input: string) => unknown;

export type ArgumentTypeFunction = (msg: Message, content: string) => unknown;

export interface Argument {
    identifier: string;
    match: "rest" | "single" | "multiple" | "flag";
    type?: ArgumentTypeFunction | string;
    optional?: boolean;
    flag?: string;
    default?: ((msg: Message) => any) | any;
    prompt?: ((msg: Message) => string) | string;
}