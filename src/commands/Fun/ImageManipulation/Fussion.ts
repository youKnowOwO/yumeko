import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message, User } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("fusion", {
    aliases: ["fusion"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_FUSSION_DESCRIPTION"),
        usage: "fusion <user> [user]",
        examples: ["fusion @unknown"]
    },
    category: "fun",
    permissions: {
        client: ["ATTACH_FILES"]
    },
    args: [
        {
            identifier: "user",
            match: "single",
            type: "user",
            prompt: (msg): string => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_FUSSION_PROMPT")
        },
        {
            identifier: "user2",
            match: "single",
            type: "user",
            default: (msg: Message): string => msg.author.id
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { user, user2 } : { user: User; user2: User }): Promise<Message> {
        const m = await msg.channel.send(msg.ctx.lang("COMMAND_FUN_PAINTING"));
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/fusion")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({
                baseImage: user2.displayAvatarURL({ format: "png", size: 512, dynamic: true }),
                overlayImage: user.displayAvatarURL({ format: "png", size: 512, dynamic: true })
            });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "fusion.png"}]});
    }
}