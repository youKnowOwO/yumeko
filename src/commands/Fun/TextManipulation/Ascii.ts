import Command from "@yumeko/classes/Command";
import CustomError from "@yumeko/classes/CustomError";
import figlet from "figlet";
import type { Message } from "discord.js";
import { promisify } from "util";
import { codeBlock } from "@yumeko/util/Util";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("asciify", {
    aliases: ["asciify", "ascii"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_TEXT_MANIPULATION_ASCII_DESCRIPTION"),
        usage: "asciify <text>",
        examples: ["ascii yo"]
    },
    category: "fun",
    args: [
        {
            identifier: "text",
            match: "rest",
            prompt: (msg): string => msg.ctx.lang("COMMAND_TEXT_MANIPULATION_PROMPT"),
            type: (_, content: string): string => {
                if (content.length > 14) throw new CustomError("!PARSING", "**Only \`14\` characters are allowed**");
                return content;
            }
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { text }: { text: string }): Promise<Message> {
        const ascii = await promisify(figlet)(text);
        return msg.ctx.send(codeBlock("ascci", ascii as string));
    }
}