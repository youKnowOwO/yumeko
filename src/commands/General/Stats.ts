import Command from "@yumeko/classes/Command";
import moment from "moment";
import { DeclareCommand } from "@yumeko/decorators";
import { MessageEmbed, Message } from "discord.js";
import { stripIndents } from "common-tags";
import { codeBlock } from "@yumeko/util/Util";
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
        const [usersSize, channelsSize, serversSize] = this.client.shard ?
            this.parseSizeEvaluate(await this.client.shard.broadcastEval(`[
                this.users.cache.size,
                this.channels.cache.size,
                this.guilds.cache.size
            ]`)) : [this.client.users.cache.size, this.client.channels.cache.size, this.client.guilds.cache.size];
        const usage = process.memoryUsage();
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setTitle("♪ My Current Statistic")
            .setThumbnail(this.client.user!.displayAvatarURL())
            .setDescription(codeBlock("ascii", stripIndents`
                Shard          : ${Number(msg.guild!.shardID) + 1} / ${this.client.shard ? this.client.shard.count : 1}
                Memory Usage   : ${(usage.heapUsed / 1024 / 1024).toFixed(2)} / ${Math.round(100 * (usage.heapTotal / 1048576)) / 100} MB
                Uptime         : ${moment.duration(this.client.uptime).format("YY [years] MM [month] DD [days], hh:mm:ss")}
                CPU            : ${Math.round(loadavg()[0] * 100) / 100}%
                Users          : ${usersSize.toLocaleString()}
                Channels       : ${channelsSize.toLocaleString()}
                Servers        : ${serversSize.toLocaleString()}
                WS ping        : ${this.client.ws.ping.toFixed(2)}ms
                Node           : ${process.version}
            `))
            .addField("📌 Owners", this.client.config.owners.map((x: string) => {
                const user = this.client.users.cache.get(x);
                if (!user) return;
                if (msg.guild!.members.cache.has(user.id)) return `• ${user} (${user.id})`;
                return `• ${user.tag} (${user.id})`;
            }))
            .addField("\u200B", "[Github](https://github.com/youKnowOwO) | [Repository](https://github.com/youKnowOwO/yumeko)");
        return msg.ctx.send(embed);
    }

    public parseSizeEvaluate(data: [number, number, number][]): [number, number, number] {
        const result: [number, number, number] = [0, 0, 0];
        for (const dat of data)
            for (let i = 0; i < 3; i++) result[i] += dat[i];
        return result;
    }
}