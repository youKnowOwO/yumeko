import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class AchievementCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "achievement", {
            aliases: ["achievement", "acvmnt"],
            description: {
                content: "Sends a achievement with the text of your choice",
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
                    prompt: "What text do you want to achieve?"
                }
            ]
        });
    }

    public async exec(msg: Message, { text, image } : { text: string; image: string }): Promise<Message> {
        const m = await msg.channel.send("🖌️ **| Painting..**");
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/achievement")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ text, image });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "achievement.png"}]});
    }
}