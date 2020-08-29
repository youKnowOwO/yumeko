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
const TicTacToe_1 = __importDefault(require("@yumeko/classes/Games/TicTacToe"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
const common_tags_1 = require("common-tags");
const Util_1 = require("@yumeko/util/Util");
const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
let TicTacToeCommand = class TicTacToeCommand extends Command_1.default {
    async exec(msg, { opponent }) {
        if (opponent) {
            const verifyMsg = await msg.channel.send(`❓ **| ${opponent}, Do you want accept this challenge ?**`);
            const verified = await Util_1.verify(verifyMsg, opponent);
            if (!verified) {
                await verifyMsg.edit(`🍃 **| Look like ${opponent} doesn't accept your challenge. Do you want to play it with me anyway ?**`);
                const accept = await Util_1.verify(verifyMsg, msg.author);
                if (!accept) {
                    msg.ctx.send("✋ **| Ok see you next time**");
                    throw new CustomError_1.default("CANCELED");
                }
                opponent = this.client.user;
            }
        }
        else
            opponent = this.client.user;
        const message = await msg.channel.send("🖌️ **| Preparing**");
        for (const num of numbers)
            await message.react(num);
        const ttt = new TicTacToe_1.default();
        while (!ttt.isEnd()) {
            const user = ttt.turn ? msg.author : opponent;
            await message.edit(common_tags_1.stripIndents `
                <:tictactoe:736370109073063946> **| ${user}, Turn!**
                > ${ttt.toString().replace(/\n/g, "\n> ")}
            `);
            if (user.bot) {
                await discord_js_1.Util.delayFor(1000);
                ttt.placeAI(8);
                continue;
            }
            const filter = (m, usr) => numbers.includes(m.emoji.name)
                && usr.id === user.id
                && ttt.canPlace(...ttt.parsePosition(numbers.indexOf(m.emoji.name) + 1));
            const responses = await message.awaitReactions(filter, { max: 1, time: 30000 });
            if (!responses.size) {
                ttt.giveUp();
                break;
            }
            const index = numbers.indexOf(responses.first().emoji.name);
            ttt.place(...ttt.parsePosition(index + 1));
        }
        return message.edit(common_tags_1.stripIndents `
            ${ttt.winner ? `🎉 **| Congrats ${ttt.turn ? msg.author : opponent}, you win the match!**` : "🇴 **| Draw!**"}
            > ${ttt.toString().replace(/\n/g, "\n> ")}
        `);
    }
};
TicTacToeCommand = __decorate([
    decorators_1.DeclareCommand("game-tictactoe", {
        aliases: [],
        description: {
            content: "Play Tic Tac Toe game with other user. This is solved game, you must placing 3 marks horizontal vertical or diagonal to win the match.",
            usage: "<user>",
            examples: ["game-tictactoe"],
            adionalInfo: ["<:tictactoe:736370109073063946> Tic Tac Toe", "tictactoe", "ttt"]
        },
        category: "fun",
        args: [
            {
                identifier: "opponent",
                match: "rest",
                type: "user:human",
                optional: true
            }
        ]
    })
], TicTacToeCommand);
exports.default = TicTacToeCommand;
