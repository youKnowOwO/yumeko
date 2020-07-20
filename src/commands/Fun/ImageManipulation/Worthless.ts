import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class WorthlessCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "worthless", {
            aliases: ["worthless"],
            description: {
                content: "Draws an image over Gravity Falls \"Oh, this? This is worthless.\" meme",
                usage: "worthless [user|image]",
                examples: ["worthless"]
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

    public async exec(msg: Message, { image } : { image: string }): Promise<void> {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/worthless")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image });
        m.delete();
        msg.ctx.send({files:[{attachment, name: "worthless.png"}]});
    }
}