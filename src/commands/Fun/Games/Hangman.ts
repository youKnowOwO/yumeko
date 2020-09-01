import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { stripIndents } from "common-tags";
import { codeBlock } from "@yumeko/util/Util";

const words = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

export default class HangmanCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "game-hangman", {
            aliases: [],
            description: {
                content: (msg): string => msg.guild!.loc.get("COMMAND_GANE_HANGMAN_DESCRIPTION"),
                usage: "[range]",
                examples: ["game-hangman"],
                adionalInfo: ["<:hangman:736148147038060554> Hangman", "hangman", "hm"]
            },
            category: "fun"
        });
    }

    public async exec(msg: Message): Promise<Message> {
        const { body }: any = await request.get("https://emilia-api.xyz/api/hangman")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`);
        const word: string[] = body.word.split("");
        const guessedWords: string[] = [];
        const failedWords: string[] = [];
        let passes = 0;
        while(guessedWords.length !== new Set(word).size && passes < 7) {
            await msg.channel.send(stripIndents`
                <:hangman:736148147038060554> **| Hangman**
                ${codeBlock("", word.map(x => guessedWords.includes(x.toLowerCase()) ? x : "◯").join(" "))}
                ${this.getHangedMan(passes)}
                ${codeBlock("", failedWords.join(" "))}
            `);
            const filter = (m: Message): boolean => m.content.length < 2
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
            const alphabet = responses.first()!.content.toLowerCase();
            if (word.includes(alphabet)) guessedWords.push(alphabet);
            else {
                failedWords.push(alphabet);
                passes++;
            }
        }
        if (passes < 7) return msg.ctx.send(msg.guild!.loc.get("COMMAND_GAME_LIST_RIGHT", word.join("")));
        return msg.ctx.send(msg.guild!.loc.get("COMMAND_GAME_LIST_WRONG", words.join("")));
    }

    public getHangedMan(passes: number): string {
        return stripIndents`
            > .┌─────┐
            > .┃................┋
            > .┃................┋
            > .┃${passes > 0 ? `..............${passes > 5 ? "😭" : "😲"}` : ""}
            > .┃${passes > 1 ? "............../": ""} ${passes > 2 ? "|" : ""} ${passes > 3 ? "\\" : ""}
            > .┃${passes > 4 ? ".............../" : ""} ${passes > 5 ? "\\" : ""}
            > /-\\
        `;
    }
}