import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import { MessageEmbed, Message } from "discord.js";
import { firstUpperCase } from "@yumeko/util/Util";

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
            .setTitle(msg.guild!.loc.get("COMMAND_ANIMAL_CLICK_HERE"))
            .setImage(image);
        return msg.ctx.send(embed);
    }

    public async getImage(): Promise<string> {
        const { body }: any = await request.get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
        return body.media.gif;
    }
}