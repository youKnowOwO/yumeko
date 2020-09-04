import YumekoClient from "@yumeko/classes/Client";
import { Structures } from "discord.js";
import MusicHandler from "@yumeko/libs/MusicHandler";
import { Localization } from "@yumeko/libs/Localization";

class YumekoGuild extends Structures.get("Guild") {
    public music: MusicHandler = new MusicHandler(this);
    public loc: Localization = new Localization(this);
    public prefix: string = (this.client as YumekoClient).config.prefix;

    public updateDatabase(): Promise<boolean> {
        const client = this.client as YumekoClient;
        return client.db.guild.set(this.id, {
            prefix: this.prefix,
            lang: this.loc.lang
        });
    }

    public assignDatabase(value: YumekoClient["db"]["guild"]["defaultValue"]): void {
        this.prefix = value!.prefix;
        this.loc.lang = value!.lang;
    }
}

declare module "discord.js" {
    export interface Guild {
        music: MusicHandler;
        loc: Localization;
        prefix: string;

        updateDatabase(): Promise<boolean>;
        assignDatabase(value: YumekoClient["db"]["guild"]["defaultValue"]): void;
    }
}

Structures.extend("Guild", () => YumekoGuild);