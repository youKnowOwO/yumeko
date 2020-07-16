import { Structures } from "discord.js";

class YumekoMessage extends Structures.get("Message") {
    public args: string[] = [];
    public prefix?: string;
}

declare module "discord.js" {
    interface Message {
        args: string[];
        prefix?: string;
    }
}

Structures.extend("Message", () => YumekoMessage);