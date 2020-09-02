import YumekoClient from "@yumeko/classes/Client";
import { Structures } from "discord.js";
import MusicHandler from "@yumeko/libs/MusicHandler";
import { Localization } from "@yumeko/libs/Localization";

class YumekoGuild extends Structures.get("Guild") {
    public music: MusicHandler = new MusicHandler(this);
    public loc: Localization = new Localization(this);
    public prefix: string = (this.client as YumekoClient).config.prefix;
}

declare module "discord.js" {
    export interface Guild {
        music: MusicHandler;
        loc: Localization;
        prefix: string;
    }
}

Structures.extend("Guild", () => YumekoGuild);