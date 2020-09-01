"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
const Util_1 = require("@yumeko/util/Util");
const wordList = require("../../../../assets/json/words.json");
let WordChainCommand = class WordChainCommand extends Command_1.default {
    async exec(msg, { users }) {
        const words = Util_1.shuffle(wordList);
        const players = this.createPlayers(users);
        let currentWord = words.shift();
        let turn = 0;
        let winner;
        let isroll = false;
        let displayMessage;
        await msg.channel.send(`**🔗 | Game Started in \`5 seconds\` with word \`${currentWord}\`!.\n> Each player only had \`10 seconds\` to type the word. If you wanna quit the game just type \`${msg.prefix}giveup\` or if you want to reroll the current word use \`${msg.prefix}roll\`**`);
        await discord_js_1.Util.delayFor(5000);
        while (!winner && words.length) {
            if (turn >= players.length)
                turn = 0;
            const player = players[turn];
            if (player.isGiveUp) {
                turn++;
                continue;
            }
            if (displayMessage)
                displayMessage.delete().catch();
            displayMessage = await msg.channel.send(`🎲 **| ${player.user}, ${isroll ? "Type the word" : "It's your turn!"}**`);
            const lastLetter = currentWord.charAt(currentWord.length - 1);
            if (player.user.bot) {
                await discord_js_1.Util.delayFor(5000);
                let result = words.find(x => x.startsWith(lastLetter));
                if (!result) {
                    if (player.chanceRoll && words.length) {
                        await msg.channel.send(`${msg.prefix} reroll`);
                        result = words[0];
                        player.chanceRoll--;
                    }
                    else {
                        player.isGiveUp = true;
                    }
                }
                if (result) {
                    player.words++;
                    currentWord = result;
                    words.splice(words.indexOf(result), 1);
                    await msg.channel.send(result);
                }
            }
            else {
                const filter = (mess) => {
                    const content = mess.content.toLowerCase();
                    if (mess.author.id !== player.user.id)
                        return false;
                    if (mess.content.startsWith(msg.prefix)) {
                        const clear = content.slice(msg.prefix.length);
                        if (!["roll", "giveup"].includes(clear))
                            return false;
                        if (clear === "roll" && !player.chanceRoll) {
                            mess.channel.send("❌ **| You don't had any chance to roll**");
                            return false;
                        }
                        return true;
                    }
                    if (words.includes(content)) {
                        if (!isroll && !content.startsWith(lastLetter))
                            return false;
                        return true;
                    }
                    return false;
                };
                const responses = await msg.channel.awaitMessages(filter, { max: 1, time: 10000 });
                if (!responses.size) {
                    player.isGiveUp = true;
                    await msg.channel.send(`⏱️ **| ${player.user}, Timeout!**`);
                }
                else {
                    const content = responses.first().content.toLowerCase();
                    if (content === `${msg.prefix}roll`) {
                        isroll = true;
                        player.chanceRoll--;
                        continue;
                    }
                    else if (content === `${msg.prefix}giveup`) {
                        player.isGiveUp = true;
                    }
                    else {
                        currentWord = content;
                        words.splice(words.indexOf(content), 1);
                        player.words++;
                    }
                }
            }
            if (player.isGiveUp)
                await msg.channel.send(`✋ **| ${player.user}, Give Up!**`);
            if (players.filter(x => !x.isGiveUp).length === 1)
                winner = players.find(x => !x.isGiveUp);
            turn++;
            isroll = false;
        }
        if (displayMessage)
            displayMessage.delete().catch();
        if (winner) {
            const description = players.sort(({ words: a }, { words: b }) => b - a).map((x, i) => `\`${i + 1}.\` ${x.user} (${x.words} words)`);
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.client.config.color)
                .setTitle("Leaderboard Word")
                .setDescription(description);
            return msg.ctx.send(`🎉 **| Congrats, ${winner.user} you won this match**`, { embed });
        }
        return msg.ctx.send(`✋ **| Draw!. You all such an amazing human cause \`${words}\` is used!.`);
    }
    createPlayers(users) {
        return users.map(x => ({
            user: x,
            isGiveUp: false,
            chanceRoll: 3,
            words: 0
        }));
    }
};
__decorate([
    decorators_1.doPlayersSelection("users", {
        includeClientReq: true,
        checkDM: false,
        min: 2, max: 20
    })
], WordChainCommand.prototype, "exec", null);
WordChainCommand = __decorate([
    decorators_1.DeclareCommand("game-wordchain", {
        aliases: [],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_GAME_WORD_CHAIN_DESCRIPTION"),
            usage: "",
            examples: ["game-wordchain"],
            adionalInfo: ["🔗 Word Chain", "wordchain", "shiritori"]
        },
        permissions: {
            client: ["EMBED_LINKS", "ADD_REACTIONS"]
        },
        category: "game"
    })
], WordChainCommand);
exports.default = WordChainCommand;
