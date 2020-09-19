import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("cat", {
    aliases: ["cat", "kitty"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_ANIMAL_DESCRIPTION", 2),
        usage: "cat",
        examples: ["cat"]
    },
    permissions: {
        client: ["ATTACH_FILES"]
    },
    category: "animals",
})
export default class extends Command {
    @constantly
    public exec(msg: Message): Promise<Message> {
        return msg.ctx.send({ files: [{ attachment: "https://cataas.com/cat", name: "cat.jpg"}] });
    }
}