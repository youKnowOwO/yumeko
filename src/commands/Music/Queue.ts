import Command from "@yumeko/classes/Command";
import { MessageEmbed, Message } from "discord.js";
import { chunk } from "@yumeko/util/Util";
import Pagination from "@yumeko/util/Pagination";
import { DeclareCommand } from "@yumeko/decorators";

@DeclareCommand("queue", {
    aliases: ["queue", "nowplay"],
    description: {
        content: "queue",
        usage: "queue",
        examples: ["queue"]
    },
    cooldown: 6,
    permissions: {
        client: ["EMBED_LINKS", "ADD_REACTIONS"]
    },
    category: "music",
})
export default class QueueCommand extends Command {
    public async exec(msg: Message): Promise<Message|void> {
        const { music } = msg.guild!;
        if (!music.song) return msg.ctx.send("💤 **| Not Playing anything right now**");
        if (!music.queue.length) return msg.ctx.send("🍃 **| Empty queue**");
        this.collector!.commands.get("np")!.exec(msg);
        const pages = chunk(music.queue.map((x, i) => `\`${i + 1}\`. __**[${x.title}](${x.uri})**__ **by** ${x.requester.toString()}`), 10)
            .map(x => x.join("\n"));
        const embed = new MessageEmbed()
            .setColor(this.client.config.color);
        await new Pagination(msg, {
            pages, embed,
            edit: (i, emb, page): MessageEmbed => emb.setDescription(page).setFooter(`Page ${i+1} of ${pages.length}`)
        }).start();
    }
}