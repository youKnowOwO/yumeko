import Command from "@yumeko/classes/Command";
import { MessageEmbed, Message } from "discord.js";
import { chunk } from "@yumeko/util/Util";
import Pagination from "@yumeko/util/Pagination";
import { DeclareCommand, isMusicPlaying, isInStream } from "@yumeko/decorators";

@DeclareCommand("queue", {
    aliases: ["queue", "nowplay"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_MUSIC_QUEUE_DESCRIPTION"),
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
    @isInStream()
    @isMusicPlaying()
    public async exec(msg: Message): Promise<Message|void> {
        const { music } = msg.guild!;
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await this.collector!.commands.get("np")!.exec(msg);
        if (!music.queue.length) return msg;
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