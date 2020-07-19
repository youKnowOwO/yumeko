import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import request from "node-superfetch";
import { Message } from "discord.js";
import { firstUpperCase } from "../../util/Util";

export default class AmazedCommand extends Command {
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

    public async exec(msg: Message): Promise<void> {
        const { raw: attachment } = await request.get(`${this.api}${this.identifier}`)
            .set("Authorization", `Bearer ${process.env.EMIAPI}`);
        msg.ctx.send({files:[{attachment, name: `${this.identifier}.gif`}]});
    }
}