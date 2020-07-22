import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import request from "node-superfetch";
import type { Message, User } from "discord.js";

export default class FusionCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "fusion", {
            aliases: ["fusion"],
            description: {
                content: "Fusion 2 user",
                usage: "fusion <user> [user]",
                examples: ["fusion @unknown"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "user",
                    match: "single",
                    type: "user",
                    prompt: "Which user do you want to fusion ?"
                },
                {
                    identifier: "user2",
                    match: "single",
                    type: "user",
                    default: (msg: Message): User => msg.author
                }
            ]
        });
    }

    public async exec(msg: Message, { user, user2 } : { user: User; user2: User }): Promise<Message> {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/fusion")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({
                baseImage: user2.displayAvatarURL({ format: "png", size: 512, dynamic: true }),
                overlayImage: user.displayAvatarURL({ format: "png", size: 512, dynamic: true })
            });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "fusion.png"}]});
    }
}