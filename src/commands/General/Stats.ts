import Command from "../../classes/Command";
import moment from "moment";
import { DeclareCommand } from "../../decorators";
import { MessageEmbed, Message } from "discord.js";
import { stripIndents } from "common-tags";
import { codeBlock } from "../../util/Util";
import { loadavg } from "os";

@DeclareCommand("stats", {
    aliases: ["stats"],
    description: {
        content: "Statistic about this bot",
        usage: "stats",
        examples: ["stats"]
    },
    permissions: {
        client: ["EMBED_LINKS"]
    },
    category: "general",
})
export default class StatsCommand extends Command {
    public async exec(msg: Message): Promise<Message> {
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setTitle("♪ My Current Statistic")
            .setThumbnail(this.client.user!.displayAvatarURL())
            .setDescription(codeBlock("ini", stripIndents`
                Memory Usage   : ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB
                Uptime         : ${moment(this.client.uptime).format("hh:mm:ss")}
                CPU            : ${Math.round(loadavg()[0] * 100) / 100}%
                Users          : ${this.client.users.cache.size.toLocaleString()}
                Channels       : ${this.client.channels.cache.size.toLocaleString()}
                Servers        : ${this.client.guilds.cache.size.toLocaleString()}
                WS ping        : ${this.client.ws.ping.toFixed(2)}ms
                Node           : ${process.version}
            `))
            .addField("📌 Owners", this.client.config.owners.map((x: string) => {
                const user = this.client.users.cache.get(x);
                if (!user) return;
                if (msg.guild!.members.cache.has(user.id)) return `• ${user} (${user.id})`;
                return `• ${user.tag} (${user.id})`;
            }))
            .addField("\u200B", "[Github](https://github.com/youKnowOwO) | [Repository](https://github.com/youKnowOwO/yumeko-ts)");
        return msg.ctx.send(embed);
    }
}