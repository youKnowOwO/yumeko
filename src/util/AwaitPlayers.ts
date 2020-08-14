/* eslint-disable @typescript-eslint/no-misused-promises */
import type YumekoClient from "../classes/Client";
import { AwaitPlayersPayload } from "../interfaces";
import { User, MessageEmbed } from "discord.js";
import { MessageReaction } from "discord.js";

export default class AwaitPlayers {
    public readonly client = this.payload.message.client as YumekoClient;
    public constructor(public payload: AwaitPlayersPayload) {}

    public async start(): Promise<User[]> {
        return new Promise(async resolve => {
            const players = [this.payload.message.author];
            const reactions = [{ emoji: "👤", mess: "react this to join" }];
            if (this.payload.includeClientReq) reactions.push({ emoji: "🤖", mess: "react this to include me" });
            reactions.push({ emoji: "❌", mess: "react this to cancel" });
            const embed = new MessageEmbed()
                .setColor(this.client.config.color)
                .setTitle("👥 Players")
                .setDescription(players.map(x => `• ${x}`).join("\n"))
                .setFooter("ℹ️ Players selection lasts 30 minutes");
            embed.fields = [{ value: reactions.map(x => `${x.emoji}: ${x.mess}`).join("\n"), name: "\u200B", inline: false }];
            const msg = await this.payload.message.channel.send(embed);
            for (const react of reactions) await msg.react(react.emoji);
            this.client.setMaxListeners(this.client.getMaxListeners() + 1);
            this.client.addListener("messageReactionAdd", onReact);
            const { payload } = this;
            async function onReact({ emoji, message }: MessageReaction, user: User): Promise<void> {
                if (message.id !== msg.id || user.bot
                    || reactions.some(x => x.emoji === emoji.name)) return undefined;
                switch (emoji.name) {
                    case "👤":
                        if (players.includes(user)) break;
                        try {
                            if (payload.checkDM) {
                                if (!user.dmChannel) break;
                                await user.dmChannel.send("**ℹ️ | Just checking dm channel**");
                                break;
                            }
                            players.push(user);
                        } catch {
                            break;
                        }
                    case "🤖":
                        if (user.id !== payload.message.author.id) break;
                        players.push(payload.message.client.user!);
                        reactions.splice(reactions.map(x => x.emoji).indexOf("🤖"), 1);
                        break;
                    case "❌":
                        if (user.id !== payload.message.author.id) break;
                        return onEnd([]);
                    case "✅":
                        if (user.id !== payload.message.author.id) break;
                        return onEnd(players);
                }
            }
            function onEnd(result: User[]): void {
                payload.message.client.removeListener("messageReactionAdd", onReact);
                payload.message.client.setMaxListeners(payload.message.client.getMaxListeners() - 1);
                resolve(result);
            }
        });
    }
}