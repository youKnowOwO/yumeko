import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("rejected", {
    aliases: ["rejected"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_REJECTED_DESCRIPTION"),
        usage: "rejected [user|image]",
        examples: ["rejected"]
    },
    category: "fun",
    permissions: {
        client: ["ATTACH_FILES"]
    },
    args: [
        {
            identifier: "image",
            match: "rest",
            type: "image",
            default: (msg: Message): string => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { image } : { image: string }): Promise<Message> {
        const m = await msg.channel.send(msg.ctx.lang("COMMAND_FUN_PAINTING"));
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/rejected")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "rejected.png"}]});
    }
}