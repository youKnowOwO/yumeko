import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class DistortCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "distort", {
            aliases: ["distort"],
            description: {
                content: "Draws an image but distorted",
                usage: "distort [user|image] [--level=<number>]",
                examples: ["distort"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "level",
                    match: "flag",
                    type: "number",
                    flag: "level",
                    default: 10
                },
                {
                    identifier: "image",
                    match: "rest",
                    type: "image",
                    default: (msg: Message): string => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
                }
            ]
        });
    }

    public async exec(msg: Message, { image, level } : { image: string; level: number }): Promise<Message> {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/distort")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image, level } as any);
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "distort.png"}]});
    }
}