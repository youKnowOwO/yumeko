import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import { Message } from "discord.js";
import { firstUpperCase } from "@yumeko/util/Util";

export default class extends Command {
    private api = "https://emilia-api.xyz/api/";
    public constructor (client: YumekoClient, react = "amazed") {
        super(client, react, {
            aliases: [react],
            description: {
                content: `Random ${firstUpperCase(react)} image.`,
                usage: react,
                examples: [react]
            },
            permissions: {
                client: ["ATTACH_FILES"]
            },
            category: "reactions",
        });
    }

    public async exec(msg: Message): Promise<Message> {
        const { raw: attachment } = await request.get(`${this.api}${this.identifier}`)
            .set("Authorization", `Bearer ${process.env.EMIAPI}`);
        return msg.ctx.send({files:[{attachment, name: `${this.identifier}.gif`}]});
    }
}