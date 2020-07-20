import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class BrazzersCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "brazzers", {
            aliases: ["brazzers"],
            description: {
                content: "Draws an image with the Brazzers logo in the corner",
                usage: "brazzers [user|image]",
                examples: ["brazzers"]
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
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/brazzers")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image });
        m.delete();
        msg.ctx.send({files:[{attachment, name: "brazzers.png"}]});
    }
}