import type { Message, MessageEmbed } from "discord.js";
import type { ArgumentTypeFunction } from "@yumeko/interfaces/Command";
import type { DefaultLang } from "@yumeko/libs/Localization";

export interface Type {
    readonly name: string;
    exec: ArgumentTypeFunction;
}

export interface TypeCodeReturn {
    code: string;
    lang?: string;
}

export interface MessageContext {
    send(content: unknown, options?: any): Promise<Message>;
    lang<K extends keyof DefaultLang>(key: K, ...args: Parameters<DefaultLang[K]>): string;
}

export interface PaginationPayload {
    pages: string[];
    embed: MessageEmbed;
    edit(index: number, embed: MessageEmbed, page: string): unknown;
}

export interface SelectionPagePayload<T> {
    emojis: string[];
    cancelEmo: string;
    selections: T[];
    embed: MessageEmbed;
}

export interface AwaitPlayersPayload {
    includeClientReq: boolean;
    checkDM: boolean | string;
    message?: Message;
    min: number;
    max: number;
}

export interface EqualizerBand {
    band: number;
    gain: number;
}

export interface DataNowplayMoe {
    title: string;
    artists?: string;
    requester?: string;
    source?: string;
    albums?: string;
    cover: string;
    event?: {
        name: string;
        image: string;
    };
    listeners: number;
}