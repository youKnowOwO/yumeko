import { Structures } from "discord.js";
import MusicHandler from "@yumeko/libs/MusicHandler";
import { Localization } from "@yumeko/libs/Localization";

class YumekoGuild extends Structures.get("Guild") {
    public music: MusicHandler = new MusicHandler(this);
    public loc: Localization = new Localization(this);
}

declare module "discord.js" {
    export interface Guild {
        music: MusicHandler;
        loc: Localization;
    }
}

Structures.extend("Guild", () => YumekoGuild);