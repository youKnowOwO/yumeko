import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class extends Command {
    public constructor (client: YumekoClient) {
        super(client, "to-be-continued", {
            aliases: ["to-be-continued", "tobecontinued", "tobec"],
            description: {
                content: "Draws an image with the \"To Be Continued...\" arrow",
                usage: "to-be-continued [user|image]",
                examples: ["to-be-continued"]
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
        });
    }

    public async exec(msg: Message, { image } : { image: string }): Promise<Message> {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/to-be-continued")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "to-be-continued.png"}]});
    }
}