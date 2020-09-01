"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const common_tags_1 = require("common-tags");
const Util_1 = require("@yumeko/util/Util");
const words = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
class HangmanCommand extends Command_1.default {
    constructor(client) {
        super(client, "game-hangman", {
            aliases: [],
            description: {
                content: (msg) => msg.guild.loc.get("COMMAND_GANE_HANGMAN_DESCRIPTION"),
                usage: "[range]",
                examples: ["game-hangman"],
                adionalInfo: ["<:hangman:736148147038060554> Hangman", "hangman", "hm"]
            },
            category: "fun"
        });
    }
    async exec(msg) {
        const { body } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/hangman")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`);
        const word = body.word.split("");
        const guessedWords = [];
        const failedWords = [];
        let passes = 0;
        while (guessedWords.length !== new Set(word).size && passes < 7) {
            await msg.channel.send(common_tags_1.stripIndents `
                <:hangman:736148147038060554> **| Hangman**
                ${Util_1.codeBlock("", word.map(x => guessedWords.includes(x.toLowerCase()) ? x : "◯").join(" "))}
                ${this.getHangedMan(passes)}
                ${Util_1.codeBlock("", failedWords.join(" "))}
            `);
            const filter = (m) => m.content.length < 2
                && words.includes(m.content.toLowerCase())
                && !guessedWords.includes(m.content.toLowerCase())
                && !failedWords.includes(m.content.toLowerCase())
                && msg.author.id === m.author.id;
            const responses = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });
            if (!responses.size) {
                passes = 8;
                msg.channel.send("⏱️ **| Timeout**");
                break;
            }
            const alphabet = responses.first().content.toLowerCase();
            if (word.includes(alphabet))
                guessedWords.push(alphabet);
            else {
                failedWords.push(alphabet);
                passes++;
            }
        }
        if (passes < 7)
            return msg.ctx.send(msg.guild.loc.get("COMMAND_GAME_LIST_RIGHT", word.join("")));
        return msg.ctx.send(msg.guild.loc.get("COMMAND_GAME_LIST_WRONG", words.join("")));
    }
    getHangedMan(passes) {
        return common_tags_1.stripIndents `
            > .┌─────┐
            > .┃................┋
            > .┃................┋
            > .┃${passes > 0 ? `..............${passes > 5 ? "😭" : "😲"}` : ""}
            > .┃${passes > 1 ? "............../" : ""} ${passes > 2 ? "|" : ""} ${passes > 3 ? "\\" : ""}
            > .┃${passes > 4 ? ".............../" : ""} ${passes > 5 ? "\\" : ""}
            > /-\\
        `;
    }
}
exports.default = HangmanCommand;
