import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class BobrossCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "bob-ross", {
            aliases: ["bob-ross", "bobross"],
            description: {
                content: "Draws an image over Bob Ross canvas",
                usage: "bob-ross [user|image]",
                examples: ["bob-ross"]
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
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/bob-ross")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "bob-ross.png"}]});
    }
}