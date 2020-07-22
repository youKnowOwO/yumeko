import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class LisaPresentationCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "lisa-presentation", {
            aliases: ["lisa-presentation", "lisapresentation", "lisap"],
            description: {
                content: "Sends a \"Lisa Presentation\" meme with the presentation of your choice",
                usage: "lisa-presentation <text>",
                examples: ["lisa-presentation idk"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "text",
                    match: "rest",
                    type: "string",
                    prompt: "What the text to be presented ?"
                }
            ]
        });
    }

    public async exec(msg: Message, { text } : { text: string }): Promise<Message> {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/lisa-presentation")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ text });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "lisa-presentation.png"}]});
    }
}