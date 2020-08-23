import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { DeclareCommand } from "@yumeko/decorators";

@DeclareCommand("cat", {
    aliases: ["cat"],
    description: {
        content: "Random Cat image.",
        usage: "cat",
        examples: ["cat", "kitty"]
    },
    permissions: {
        client: ["ATTACH_FILES"]
    },
    category: "animals",
})
export default class CatCommand extends Command {
    public exec(msg: Message): Promise<Message> {
        return msg.ctx.send({ files: [{ attachment: "https://cataas.com/cat", name: "cat.jpg"}] });
    }
}