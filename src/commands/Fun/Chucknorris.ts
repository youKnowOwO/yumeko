import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("chucknorris", {
    aliases: ["chucknorris"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_CHUCKNORRIS_DESCRIPTION"),
        usage: "chucknorris",
        examples: ["chucknorris"]
    },
    category: "fun"
})
export default class extends Command {
    @constantly
    public async exec(msg: Message): Promise<Message> {
        const { body }: any = await request.get("https://api.icndb.com/jokes/random");
        return msg.ctx.send(`📢 **| ${body.value.joke}**`);
    }
}