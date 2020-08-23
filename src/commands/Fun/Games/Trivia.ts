import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import SelectionPage from "@yumeko/util/SelectionPage";
import request from "node-superfetch";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";
import { shuffle } from "@yumeko/util/Util";

const emojis = ["🇦", "🇧", "🇨", "🇩", "🇪"];

export default class TriviaCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "game-trivia", {
            aliases: [],
            description: {
                content: "Test your knowledge with random question!. Ill give you some random questions and you must answer it.",
                usage: "[range]",
                examples: ["game-trivia"],
                adionalInfo: ["<:trivia:449753526592208907> Trivia", "trivia", "quest"]
            },
            category: "fun"
        });
    }

    public async exec(msg: Message): Promise<Message> {
        const { body }: any = await request.get("https://opentdb.com/api.php")
            .query({ amount: 1 } as any);
        let selections: string[] = body.results[0].incorrect_answers;
        const rightAnswer = body.results[0].correct_answer;
        selections.push(rightAnswer);
        selections = shuffle(selections);
        const embed = new MessageEmbed()
            .setColor("#87C5F1")
            .setAuthor("Trivia", "https://cdn.discordapp.com/emojis/449753526592208907.png")
            .setDescription(stripIndents`
                ${body.results[0].question.split("\n").map((x: string) => `> **${x}**`).join("\n")}
                ${selections.map((x, i) => `${emojis[i]} ${x}`).join("\n")}
            `);
        const result = await new SelectionPage(msg, {
            selections, emojis, embed,
            cancelEmo: "❌"
        }).start();
        if (!result) msg.channel.send("⏱️ **| Timeout**");
        if (result === rightAnswer) return msg.ctx.send(`✅ **| You're right it was \`${rightAnswer}\`**`);
        return msg.ctx.send(`❌ **| Too bad it was \`${rightAnswer}\`**`);
    }
}