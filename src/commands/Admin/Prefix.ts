import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("prefix", {
    aliases: ["prefix", "setprefix"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_PREFIX_DESCRIPTION"),
        usage: "prefix [pref]",
        examples: ["prefix", "prefix !"]
    },
    category: "admin",
    permissions: {
        user: ["MANAGE_GUILD"]
    },
    args: [
        {
            identifier: "prefix",
            match: "rest",
            type: "string"
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { prefix }: { prefix?: string }): Promise<Message> {
        if (prefix) {
            msg.guild!.prefix = prefix;
            if (msg.prefix) await msg.guild!.updateDatabase();
            return msg.ctx.send(msg.ctx.lang("COMMAND_PREFIX_SET_TO", prefix));
        }
        return msg.ctx.send(msg.ctx.lang("COMMAND_PREFIX_CURRENT", msg.guild!.prefix));
    }
}