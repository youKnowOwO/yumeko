import Command from "@yumeko/classes/Command";
import { Message, User, MessageEmbed, Util } from "discord.js";
import { DeclareCommand, doPlayersSelection } from "@yumeko/decorators";
import { shuffle } from "@yumeko/util/Util";

const wordList: string[] = require("../../../../assets/json/words.json");

interface Player {
    user: User;
    isGiveUp: boolean;
    chanceRoll: number;
    words: number;
}

@DeclareCommand("game-wordchain", {
    aliases: [],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_GAME_WORD_CHAIN_DESCRIPTION"),
        usage: "",
        examples: ["game-wordchain"],
        adionalInfo: ["🔗 Word Chain", "wordchain", "shiritori"]
    },
    permissions: {
        client: ["EMBED_LINKS", "ADD_REACTIONS"]
    },
    category: "game"
})
export default class extends Command {
    @doPlayersSelection("users", {
        includeClientReq: true,
        checkDM: false,
        min: 2, max: 20
    })
    public async exec(msg: Message, { users }: { users: User[] }): Promise<Message> {
        const words = shuffle(wordList);
        const players = this.createPlayers(users);
        let currentWord = words.shift()!;
        let turn = 0;
        let winner: Player|void;
        let isroll = false;
        let displayMessage: Message | void;
        await msg.channel.send(`**🔗 | Game Started in \`5 seconds\` with word \`${currentWord}\`!.\n> Each player only had \`10 seconds\` to type the word. If you wanna quit the game just type \`${msg.prefix}giveup\` or if you want to reroll the current word use \`${msg.prefix}roll\`**`);
        await Util.delayFor(5000);
        while(!winner && words.length) {
            if (turn >= players.length) turn = 0;
            const player = players[turn];
            if (player.isGiveUp) {
                turn++;
                continue;
            }
            if (displayMessage) displayMessage.delete().catch();
            displayMessage = await msg.channel.send(`🎲 **| ${player.user}, ${isroll ? "Type the word" : "It's your turn!"}**`);
            const lastLetter = currentWord.charAt(currentWord.length - 1);
            if (player.user.bot) {
                await Util.delayFor(5000);
                let result = words.find(x => x.startsWith(lastLetter));
                if (!result) {
                    if (player.chanceRoll && words.length) {
                        await msg.channel.send(`${msg.prefix} reroll`);
                        result = words[0];
                        player.chanceRoll--;
                    } else {
                        player.isGiveUp = true;
                    }
                }
                if (result) {
                    player.words++;
                    currentWord = result;
                    words.splice(words.indexOf(result), 1);
                    await msg.channel.send(result);
                }
            } else {
                const filter = (mess: Message): boolean => {
                    const content = mess.content.toLowerCase();
                    if (mess.author.id !== player.user.id) return false;
                    if (mess.content.startsWith(msg.prefix!)) {
                        const clear = content.slice(msg.prefix!.length);
                        if (!["roll", "giveup"].includes(clear)) return false;
                        if (clear === "roll" && !player.chanceRoll) {
                            mess.channel.send("❌ **| You don't had any chance to roll**");
                            return false;
                        }
                        return true;
                    }
                    if (words.includes(content)) {
                        if (!isroll && !content.startsWith(lastLetter)) return false;
                        return true;
                    }
                    return false;
                };
                const responses = await msg.channel.awaitMessages(filter, { max: 1, time: 10000 });
                if (!responses.size) {
                    player.isGiveUp = true;
                    await msg.channel.send(`⏱️ **| ${player.user}, Timeout!**`);
                } else {
                    const content = responses.first()!.content.toLowerCase();
                    if (content === `${msg.prefix}roll`) {
                        isroll = true;
                        player.chanceRoll--;
                        continue;
                    } else if (content === `${msg.prefix}giveup`) {
                        player.isGiveUp = true;
                    } else {
                        currentWord = content;
                        words.splice(words.indexOf(content), 1);
                        player.words++;
                    }
                }
            }
            if (player.isGiveUp) await msg.channel.send(`✋ **| ${player.user}, Give Up!**`);
            if (players.filter(x => !x.isGiveUp).length === 1) winner = players.find(x => !x.isGiveUp);
            turn++; isroll = false;
        }
        if (displayMessage) displayMessage.delete().catch();
        if (winner) {
            const description = players.sort(({ words: a }, { words: b }) => b - a).map((x, i) => `\`${i + 1}.\` ${x.user} (${x.words} words)`);
            const embed = new MessageEmbed()
                .setColor(this.client.config.color)
                .setTitle("Leaderboard Word")
                .setDescription(description);
            return msg.ctx.send(`🎉 **| Congrats, ${winner.user} you won this match**`, { embed });
        }
        return msg.ctx.send(`✋ **| Draw!. You all such an amazing human cause \`${words}\` is used!.`);
    }

    public createPlayers(users: User[]): Player[] {
        return users.map(x => ({
            user: x,
            isGiveUp: false,
            chanceRoll: 3,
            words: 0
        }));
    }
}