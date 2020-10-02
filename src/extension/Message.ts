import { Structures } from "discord.js";
import { MessageContext } from "@yumeko/interfaces";
import YumekoClient from "@yumeko/classes/Client";

class YumekoMessage extends Structures.get("Message") {
    public args: string[] = [];
    public prefix?: string;
    public cmd?: string;
    public ctx: MessageContext = {
        send: (content, options) => (this.client as YumekoClient).context.send(this, content, options),
        lang: (key, ...args) => (this.client as YumekoClient).context.lang(this, key, ...args)
    };
}

declare module "discord.js" {
    export interface Message {
        args: string[];
        prefix?: string;
        cmd?: string;
        ctx: MessageContext;
    }
}

Structures.extend("Message", () => YumekoMessage);