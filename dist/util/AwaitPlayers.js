"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class AwaitPlayers {
    constructor(payload) {
        this.payload = payload;
        this.client = this.payload.message.client;
    }
    static async isDMEnable(user) {
        try {
            if (!user.dmChannel)
                return false;
            await user.dmChannel.send("**ℹ️ | Just checking dm channel**");
            return true;
        }
        catch {
            return false;
        }
    }
    async start() {
        return new Promise(async (resolve) => {
            const players = [this.payload.message.author];
            let reactions = [{ emoji: "👤", mess: this.payload.message.guild.loc.get("COMMAND_GAME_REACT_THIS_TO_JOIN") }];
            if (this.payload.includeClientReq)
                reactions.push({ emoji: "🤖", mess: this.payload.message.guild.loc.get("COMMAND_GAME_REACT_THIS_TO_INCLUDE_ME") });
            reactions.push({ emoji: "❌", mess: this.payload.message.guild.loc.get("COMMAND_GAME_REACT_THIS_TO_CANCEL") });
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.client.config.color)
                .setTitle(this.payload.message.guild.loc.get("COMMAND_GAME_AWAIT_PLAYER_LIST"))
                .setDescription(players.map(x => `• ${x}`).join("\n"))
                .setFooter(this.payload.message.guild.loc.get("COMMAND_GAME_AWAIT_PLAYER_LASTS"));
            embed.fields = [{ value: reactions.map(x => `${x.emoji}: ${x.mess}`).join("\n"), name: "\u200B", inline: false }];
            const msg = await this.payload.message.channel.send(embed);
            for (const react of reactions)
                await msg.react(react.emoji);
            this.client.setMaxListeners(this.client.getMaxListeners() + 1);
            this.client.addListener("messageReactionAdd", onReact);
            const timeout = setTimeout(onEnd.bind(null, []), 30000);
            const { payload } = this;
            async function onReact({ emoji, message }, user) {
                if (message.id !== msg.id || user.bot
                    || !reactions.some(x => x.emoji === emoji.name))
                    return undefined;
                switch (emoji.name) {
                    case "👤":
                        if (players.includes(user) || players.length > payload.max)
                            return undefined;
                        if (payload.checkDM && !(await AwaitPlayers.isDMEnable(user)))
                            return undefined;
                        players.push(user);
                    case "🤖":
                        if (user.id !== payload.message.author.id)
                            return undefined;
                        players.push(payload.message.client.user);
                        reactions.splice(reactions.map(x => x.emoji).indexOf("🤖"), 1);
                        break;
                    case "❌":
                        if (user.id !== payload.message.author.id)
                            return undefined;
                        return onEnd([]);
                    case "✅":
                        if (user.id !== payload.message.author.id)
                            return undefined;
                        return onEnd(players);
                }
                if (players.length >= payload.min) {
                    reactions.push({ emoji: "✅", mess: payload.message.guild.loc.get("COMMAND_GAME_REACT_THIS_TO_JOIN") });
                    msg.react("✅");
                    reactions = [...new Set(reactions)];
                }
                if (players.length > payload.max)
                    reactions.splice(reactions.map(x => x.emoji).indexOf("👤"), 1);
                embed.setDescription(players.map(x => `• ${x}`).join("\n"))
                    .fields = [{ value: reactions.map(x => `${x.emoji}: ${x.mess}`).join("\n"), name: "\u200B", inline: false }];
                msg.edit(embed);
            }
            function onEnd(result) {
                payload.message.client.removeListener("messageReactionAdd", onReact);
                payload.message.client.setMaxListeners(payload.message.client.getMaxListeners() - 1);
                if (result.length < payload.min)
                    result = [];
                msg.delete();
                clearTimeout(timeout);
                resolve(result);
            }
        });
    }
}
exports.default = AwaitPlayers;
