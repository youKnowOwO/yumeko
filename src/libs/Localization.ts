import type YumekoClient from "@yumeko/classes/Client";
import en_US from "@yumeko/langs/en_US";
import readdirRecursive from "@yumeko/util/ReaddirRecursive";
import { Collection, Guild } from "discord.js";
import { join } from "path";
import { hide, constantly } from "@yumeko/decorators";

export type DefaultLang = typeof en_US;

export class Localization {
    @hide
    public client = this.guild.client as YumekoClient;

    public lang = "en_US";
    public constructor(public guild: Guild) {}

    @constantly
    public get<K extends keyof DefaultLang>(key: K, ...args: Parameters<DefaultLang[K]>): string {
        const result = this.client.langs.get(this.lang);
        if (!result) return `${this.lang}: ${key}`;
        // @ts-expect-error 2556
        return result[key](...args);
    }
}

export function langCollector(): Collection<string, DefaultLang> {
    const result: ReturnType<typeof langCollector> = new Collection();
    const path = join(__dirname, "../langs");
    const files = readdirRecursive(path);
    for (const file of files) {
        const lang: DefaultLang = require(file).default;
        result.set(lang.META_ID(), lang);
    }
    return result;
}