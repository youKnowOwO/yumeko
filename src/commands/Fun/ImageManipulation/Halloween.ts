import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class HalloweenCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "halloween", {
            aliases: ["halloween"],
            description: {
                content: "Draws an image over a halloween border",
                usage: "halloween [user|image]",
                examples: ["halloween"]
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
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/halloween")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "halloween.png"}]});
    }
}