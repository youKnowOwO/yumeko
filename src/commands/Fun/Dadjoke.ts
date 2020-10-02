import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("dadjoke", {
    aliases: ["dadjoke"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_DADJOKE_DESCRIPTION"),
        usage: "dadjoke",
        examples: ["dadjoke"]
    },
    category: "fun"
})
export default class extends Command {
    @constantly
    public async exec(msg: Message): Promise<Message> {
        const { body }: any = await request.get("https://icanhazdadjoke.com/")
            .set("Accept", "application/json");
        return msg.ctx.send(`📢 **| ${body.joke.length ? body.joke : "Try Again"}**`);
    }
}