import Command from "../../../classes/Command";
import AwaitPlayers from "../../../util/AwaitPlayers";
import CustomError from "../../../classes/CustomError";
import request from "node-superfetch";
import { Message, User, MessageEmbed, Util } from "discord.js";
import { DeclareCommand } from "../../../decorators";
import { shuffle } from "../../../util/Util";


interface Player {
    user: User;
    isGiveUp: boolean;
    chanceRoll: number;
    words: number;
}

@DeclareCommand("game-wordchain", {
    aliases: [],
    description: {
        content: "This game is able to train your vocabulary, by making a word from the last letter of the previous word",
        usage: "",
        examples: ["game-wordchain"],
        adionalInfo: ["🔗 Word Chain", "wordchain", "shiritori"]
    },
    category: "game"
})
export default class WordChainCommand extends Command {
    public words: string[] = [];
    public async exec(msg: Message): Promise<Message> {
        const users = await new AwaitPlayers({
            includeClientReq: true,
            checkDM: false,
            message: msg,
            min: 2, max: 20
        }).start();
        if (!users.length) throw new CustomError("CANCELED");
        const words = shuffle(await this.fetchWords());
        const players = this.createPlayers(users);
        let currentWord = words.shift()!;
        let turn = 0;
        let winner: Player|void;
        let isroll = false;
        await msg.channel.send(currentWord);
        while(!winner && words.length) {
            if (turn >= players.length) turn = 0;
            const player = players[turn];
            if (player.isGiveUp) {
                turn++;
                continue;
            }
            msg.channel.send(`🎲 **| ${player.user}, is your turn!**`).then(x => x.delete({ timeout: 10000 }).catch());
            const lastLetter = currentWord.charAt(currentWord.length - 1);
            if (player.user.bot) {
                await Util.delayFor(5000);
                let result = words.find(x => x.startsWith(lastLetter));
                if (!result) {
                    if (player.chanceRoll) {
                        await msg.channel.send(`${msg.prefix} reroll`);
                        currentWord = words.shift()!;
                        result = currentWord;
                        player.chanceRoll--;
                    } else {
                        player.isGiveUp = true;
                    }
                }
                if (result) {
                    player.words++;
                    await msg.channel.send(result);
                }
            } else {
                const filter = (mess: Message): boolean => {
                    const content = mess.content.toLowerCase();
                    if (mess.author.id !== player.user.id) return false;
                    if (mess.content.startsWith(msg.prefix!) && ["roll", "giveup"].includes(content.slice(msg.prefix!.length))) return true;
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
                        if (!player.chanceRoll) {
                            await msg.channel.send(`❌ **| ${player.user}, you doesn'5 have chance to roll!**`).then(x => x.delete({ timeout: 10000 }).catch());
                            continue;
                        }
                        isroll = true;
                        player.chanceRoll--;
                        continue;
                    } else if (content === `${msg.prefix}giveup`) {
                        player.isGiveUp = true;
                    } else {
                        currentWord = content;
                        player.words++;
                    }
                }
            }
            if (player.isGiveUp) await msg.channel.send(`✋ **| ${player.user}, Give Up!**`);
            if (players.filter(x => !x.isGiveUp).length === 1) winner = players.find(x => !x.isGiveUp);
            turn++; isroll = false;
        }
        if (winner) {
            const description = players.map((x, i) => `\`${i + 1}.\` ${x.user} (${x.words} words)`);
            const embed = new MessageEmbed()
                .setColor(this.client.config.color)
                .setTitle("Leaderboard Word")
                .setDescription(description);
            return msg.ctx.send(`🎉 **| Congrats, ${winner.user} you won this match**`, { embed });
        }
        return msg.ctx.send(`✋ **| Draw!. You all such an amazing human cause \`${this.words.length}\` is used!.`);
    }

    public async fetchWords(): Promise<string[]> {
        if (this.words.length) return this.words.slice(0);
        const { text } = await request.get("https://raw.githubusercontent.com/dragonfire535/xiao/master/assets/json/word-list.json");
        this.words = JSON.parse(text);
        return this.words.slice(0);
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