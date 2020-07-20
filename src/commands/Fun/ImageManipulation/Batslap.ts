import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import request from "node-superfetch";
import type { Message, User } from "discord.js";

export default class BatslapCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "batslap", {
            aliases: ["batslap"],
            description: {
                content: "A batman slapping meme",
                usage: "batslap <user>",
                examples: ["batslap"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "user",
                    match: "rest",
                    type: "user",
                    prompt: "Which user do you want to slap ?"
                }
            ]
        });
    }

    public async exec(msg: Message, { user } : { user: User }): Promise<void> {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/batslap")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({
                slapper: msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true }),
                slapped: user.displayAvatarURL({ format: "png", size: 512, dynamic: true })
            });
        m.delete();
        msg.ctx.send({files:[{attachment, name: "batslap.png"}]});
    }
}