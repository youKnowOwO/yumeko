import { Structures } from "discord.js";
import MusicHandler from "../libs/MusicHandler";

class YumekoGuild extends Structures.get("Guild") {
    public music: MusicHandler = new MusicHandler(this);
}

declare module "discord.js" {
    interface Guild {
        music: MusicHandler;
    }
}

Structures.extend("Guild", () => YumekoGuild);