import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import request from "node-superfetch";
import { MessageEmbed, Message } from "discord.js";
import { firstUpperCase } from "../../util/Util";

export default class BunnyCommand extends Command {
    public constructor (client: YumekoClient, animal = "bunny") {
        super(client, animal, {
            aliases: [animal],
            description: {
                content: `Random ${firstUpperCase(animal)} image.`,
                usage: animal,
                examples: [animal]
            },
            permissions: {
                client: ["EMBED_LINKS"]
            },
            category: "animals",
        });
    }

    public async exec(msg: Message): Promise<Message> {
        const image = await this.getImage();
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setURL(image)
            .setTitle("Click here if image failed to load")
            .setImage(image);
        return msg.ctx.send(embed);
    }

    public async getImage(): Promise<string> {
        const { body }: any = await request.get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
        return body.media.gif;
    }
}