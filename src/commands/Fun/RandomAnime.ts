import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import { Message, MessageEmbed } from "discord.js";
import { DeclareCommand } from "@yumeko/decorators";
import { RandomAnimeResponse } from "@yumeko/interfaces";

@DeclareCommand("random-anime", {
    aliases: ["random-anime"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_RANDOM_ANIME_DESCRIPTION"),
        usage: "random-anime",
        examples: ["rabdom-anime"]
    },
    category: "fun"
})
export default class extends Command {
    public async exec(msg: Message): Promise<Message> {
        const response = await request.get("https://emilia-api.xyz/api/random-anime")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`);
        const body = response.body as RandomAnimeResponse;
        const embed = new MessageEmbed()
            .setTitle(body.name)
            .setColor(this.client.config.color)
            .setDescription(`> ${body.description}`)
            .setImage(body.image)
            .addField("\u200B", msg.guild!.loc.get("COMAMND_RANDOM_ANIME_PARSE_RESPONSE", body));
        if (body.alternate_name.length) embed.setTitle(body.alternate_name).setAuthor(body.name);
        const watchs: string[] = [];
        for (const key of Object.keys(body.watch)) {
            const platforms = body.watch[key].map(x => `[${x.platform}](${x.url})`).join(", ");
            watchs.push(`${key.toUpperCase()}: ${platforms}`);
        }
        embed.addField("Watch !", watchs.join("\n"));
        return msg.ctx.send(embed);
    }
}