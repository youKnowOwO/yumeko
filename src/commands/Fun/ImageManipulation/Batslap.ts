import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message, User } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("batslap", {
    aliases: ["batslap"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_BATSLAP_DESCRIPTION"),
        usage: "batslap <user>",
        examples: ["batslap @unknown"]
    },
    category: "fun",
    permissions: {
        client: ["ATTACH_FILES"]
    },
    args: [
        {
            identifier: "user",
            match: "rest",
            type: "user",
            prompt: (msg): string => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_BATSLAP_PROMPT")
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { user } : { user: User }): Promise<Message> {
        const m = await msg.channel.send(msg.ctx.lang("COMMAND_FUN_PAINTING"));
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/batslap")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({
                slapper: msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true }),
                slapped: user.displayAvatarURL({ format: "png", size: 512, dynamic: true })
            });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "batslap.png"}]});
    }
}