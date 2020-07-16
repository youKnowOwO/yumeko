import type { PermissionString, Message } from "discord.js";
import type Command from "../classes/Command";

export interface CommandOption {
    description: {
        content: string;
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
    arguments?: Argument[];
}

export interface CommandCollectorCategories {
    type: CommandOption["category"];
    commands: Command[];
}

export interface CommandUsed {
    running: boolean;
    since: number;
    amount: number;
    timeout?: unknown;
}

export type ArgumentTypeFunction = <T>(msg: Message, content: string) => T;

export interface Argument {
    identifier: string;
    match: "rest" | "single" | "multiple" | "flag";
    type?: ArgumentTypeFunction | string;
    optional?: boolean;
    flag?: string;
    prompt?: {
        ask?: ((msg: Message, type: ArgumentTypeFunction ) => string) | string;
        retry?: ((msg: Message, type: ArgumentTypeFunction ) => string) | string;
    };
}