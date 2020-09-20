import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("clapify", {
    aliases: ["clapify"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_TEXT_MANIPULATION_CLAPIFY_DESCRIPTION"),
        usage: "clapify <text>",
        examples: ["clapify good boy"]
    },
    category: "fun",
    args: [
        {
            identifier: "text",
            match: "rest",
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_TEXT_MANIPULATION_PROMPT"),
            type: "string"
        }
    ]
})
export default class extends Command {
    @constantly
    public exec(msg: Message, { text } : { text: string }): Promise<Message> {
        return msg.ctx.send(`👏${text.replace(/ +/g,"👏")}👏`);
    }
}