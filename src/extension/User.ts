import YumekoClient from "../classes/Client";
import { Structures } from "discord.js";

class YumekoUser extends Structures.get("User") {
    get isDev(): boolean {
        return (this.client as YumekoClient).config.owners.includes(this.id);
    }
}

declare module "discord.js" {
    interface User {
        isDev: boolean;
    }
}

Structures.extend("User", () => YumekoUser);