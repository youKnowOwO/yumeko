import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";

export default class ThreeThousandYearsCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "3000years", {
            aliases: ["3000years", "3ty", "threethousandyears"],
            description: {
                content: "Draws an image over Pokémon's \"It's been 3000 years\" meme",
                usage: "3000years [image|user]",
                examples: ["3000years"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "image",
                    match: "rest",
                    type: "image",
                    default: (msg: Message): string => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
                }
            ]
        });
    }

    public async exec(msg: Message, { image } : { image: string }): Promise<void> {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/3000-years")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ image });
        m.delete();
        msg.ctx.send({files:[{attachment, name: "300years.png"}]});
    }
}