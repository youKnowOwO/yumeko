import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("riot", {
    aliases: ["riot"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_TEXT_MANIPULATION_RIOT_DESCRIPTION"),
        usage: "riot <text>",
        examples: ["riot hahaha"]
    },
    category: "fun",
    args: [
        {
            identifier: "text",
            match: "rest",
            prompt: (msg): string => msg.ctx.lang("COMMAND_TEXT_MANIPULATION_PROMPT"),
            type: "string"
        }
    ]
})
export default class extends Command {
    @constantly
    public exec(msg: Message, { text } : { text: string }): Promise<Message> {
        return msg.ctx.send(`ヽ༼ຈل͜ຈ༽ﾉ ${text.toUpperCase()} ヽ༼ຈل͜ຈ༽ﾉ`);
    }
}