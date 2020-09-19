import Command from "@yumeko/classes/Command";
import moment from "moment";
import { DeclareCommand, constantly } from "@yumeko/decorators";
import { MessageEmbed, Message } from "discord.js";
import { stripIndents } from "common-tags";
import { codeBlock } from "@yumeko/util/Util";
import { loadavg } from "os";

@DeclareCommand("stats", {
    aliases: ["stats"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_STATS_DESCRIPTION"),
        usage: "stats",
        examples: ["stats"]
    },
    permissions: {
        client: ["EMBED_LINKS"]
    },
    category: "general",
})
export default class extends Command {
    @constantly
    public async exec(msg: Message): Promise<Message> {
        const [usersSize, channelsSize, serversSize] = this.client.shard ?
            this.parseSizeEvaluate(await this.client.shard.broadcastEval(`[
                this.users.cache.map(x => x.id),
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
            `));
        const owners: string[] = [];
        for (const own of this.client.config.owners) {
            const owner = this.client.users.cache.get(own) || await this.client.users.fetch(own, true).catch(() => undefined);
            if (!owner) continue;
            owners.push(`• ${msg.guild!.members.cache.has(owner.id) ? owner : owner.username} (${owner.id})`);
        }
        embed.addField("📌 Owners", owners.join("\n"))
            .addField("\u200B", "[Github](https://github.com/youKnowOwO) | [Repository](https://github.com/youKnowOwO/yumeko)");
        return msg.ctx.send(embed);
    }

    public parseSizeEvaluate(data: [string[], number, number][]): [number, number, number] {
        const result: [number, number, number] = [0, 0, 0];
        const users: string[] = [];
        for (const dat of data)
            for (let i = 0; i < 3; i++) {
                if (i === 0) {
                    users.push(...dat[i]);
                } else result[i] += dat[i] as number;
            }
        result[0] = new Set(users).size;
        return result;
    }
}