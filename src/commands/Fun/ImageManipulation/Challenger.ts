import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class ChallengerCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "challenger", {
            aliases: ["challenger"],
            description: {
                content: "Draws an image over Super Smash Bros \"Challenger Approaching\" screen",
                usage: "challenger [user|image] [--silhoute]",
                examples: ["challenger"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "silhouted",
                    match: "flag",
                    flag: "silhoute"
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

    public async exec(msg: Message, { image, silhouted } : { image: string; silhouted: boolean }): Promise<Message> {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/challenger")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image, silhouted } as any);
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "challenger.png"}]});
    }
}