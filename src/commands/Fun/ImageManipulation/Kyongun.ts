import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("kyon-gun", {
    aliases: ["kyon-gun"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_IMAGE_MANIPULATION_KYONGUN_DESCRIPTION"),
        usage: "kyon-gun [user|image]",
        examples: ["kyon-gun"]
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
        const m = await msg.channel.send(msg.guild!.loc.get("COMMAND_FUN_PAINTING"));
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/kyon-gun")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "kyon-gun.png"}]});
    }
}