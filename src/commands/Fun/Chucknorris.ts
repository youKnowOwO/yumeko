import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class ChucknorrisCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "chucknorris", {
            aliases: ["chucknorris"],
            description: {
                content: (msg): string => msg.guild!.loc.get("COMMAND_CHUCKNORRIS_DESCRIPTION"),
                usage: "chucknorris",
                examples: ["chucknorris"]
            },
            category: "fun"
        });
    }

    public async exec(msg: Message): Promise<Message> {
        const { body }: any = await request.get("https://api.icndb.com/jokes/random");
        return msg.ctx.send(`📢 **| ${body.value.joke}**`);
    }
}