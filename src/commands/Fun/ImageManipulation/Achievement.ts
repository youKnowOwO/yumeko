import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("achievement", {
    aliases: ["achievement", "acvmnt"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_IMAGE_MANIPULATION_ACHIEVEMENT_DESCRIPTION"),
        usage: "achievement <text> [--image=<image|user>]",
        examples: ["achievement"]
    },
    category: "fun",
    permissions: {
        client: ["ATTACH_FILES"]
    },
    args: [
        {
            identifier: "image",
            match: "flag",
            type: "image",
            flag: "image",
            default: (msg: Message): string => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
        },
        {
            identifier: "text",
            match: "rest",
            type: "string",
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_IMAGE_MANIPULATION_ACHIEVEMENT_PROMPT")
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { text, image } : { text: string; image: string }): Promise<Message> {
        const m = await msg.channel.send(msg.guild!.loc.get("COMMAND_FUN_PAINTING"));
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/achievement")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ text, image });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "achievement.png"}]});
    }
}