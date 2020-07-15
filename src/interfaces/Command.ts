import { PermissionString, Message } from "discord.js";

export interface CommmandOption {
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