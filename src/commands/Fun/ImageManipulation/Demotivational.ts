import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class DemotivationalCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "demotivational", {
            aliases: ["demotivational", "dmotivation", "dmtvtnl"],
            description: {
                content: "Draws an image and the text you specify as a demotivational poster",
                usage: "demotivational <title> || <text> || [user|image]",
                examples: ["demotivational YOU CAN'T DO IT || BECAUSE YOU'RE SO USELESS"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            splitBy: " || ",
            args: [
                {
                    identifier: "title",
                    match: "single",
                    type: "string",
                    prompt: "How the title about this ?"
                },
                {
                    identifier: "text",
                    match: "single",
                    type: "string",
                    prompt: "What text do you want to write ?"
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

    public async exec(msg: Message, { title, text, image } : { title: string; text: string; image: string }): Promise<Message> {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/demotivational")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ title, text, image });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "demotivational.png"}]});
    }
}