import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class DadjokeCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "dadjoke", {
            aliases: ["dadjoke"],
            description: {
                content: "Get random dad joke",
                usage: "dadjoke",
                examples: ["dadjoke"]
            },
            category: "fun"
        });
    }

    public async exec(msg: Message): Promise<Message> {
        const { body }: any = await request.get("https://icanhazdadjoke.com/")
            .set("Accept", "application/json");
        return msg.ctx.send(`📢 **| ${body.joke.length ? body.joke : "Try Again"}**`);
    }
}