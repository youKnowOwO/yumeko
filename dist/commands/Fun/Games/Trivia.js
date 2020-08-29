"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const SelectionPage_1 = __importDefault(require("@yumeko/util/SelectionPage"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const Util_1 = require("@yumeko/util/Util");
const emojis = ["🇦", "🇧", "🇨", "🇩", "🇪"];
class TriviaCommand extends Command_1.default {
    constructor(client) {
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
    async exec(msg) {
        const { body } = await node_superfetch_1.default.get("https://opentdb.com/api.php")
            .query({ amount: 1 });
        let selections = body.results[0].incorrect_answers;
        const rightAnswer = body.results[0].correct_answer;
        selections.push(rightAnswer);
        selections = Util_1.shuffle(selections);
        const embed = new discord_js_1.MessageEmbed()
            .setColor("#87C5F1")
            .setAuthor("Trivia", "https://cdn.discordapp.com/emojis/449753526592208907.png")
            .setDescription(common_tags_1.stripIndents `
                ${body.results[0].question.split("\n").map((x) => `> **${x}**`).join("\n")}
                ${selections.map((x, i) => `${emojis[i]} ${x}`).join("\n")}
            `);
        const result = await new SelectionPage_1.default(msg, {
            selections, emojis, embed,
            cancelEmo: "❌"
        }).start();
        if (!result)
            msg.channel.send("⏱️ **| Timeout**");
        if (result === rightAnswer)
            return msg.ctx.send(`✅ **| You're right it was \`${rightAnswer}\`**`);
        return msg.ctx.send(`❌ **| Too bad it was \`${rightAnswer}\`**`);
    }
}
exports.default = TriviaCommand;
