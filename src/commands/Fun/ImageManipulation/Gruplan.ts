import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class extends Command {
    public constructor (client: YumekoClient) {
        super(client, "gru-plan", {
            aliases: ["gru-plan"],
            description: {
                content: "Sends a Gru's Plan meme with steps of your choice",
                usage: "gru-plan <firstStep> || <secondStep> || <thirdStep>",
                examples: ["gru-plan I don't know || about || this meme"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            splitBy: " || ",
            args: [
                {
                    identifier: "firstStep",
                    match: "single",
                    type: "string",
                    prompt: "What the first step of your plan ?"
                },
                {
                    identifier: "secondStep",
                    match: "single",
                    type: "string",
                    prompt: "What the second step of your plan ?"
                },
                {
                    identifier: "thirdStep",
                    match: "single",
                    type: "string",
                    prompt: "What the third step of your plan ?"
                }
            ]
        });
    }

    public async exec(msg: Message,{ firstStep, secondStep, thirdStep }: { firstStep: string; secondStep: string; thirdStep: string }): Promise<Message> {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/gru-plan")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ firstStep, secondStep, thirdStep });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "gru-plan.png"}]});
    }
}