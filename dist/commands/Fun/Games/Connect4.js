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
const Connect4_1 = __importDefault(require("@yumeko/classes/Games/Connect4"));
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
const common_tags_1 = require("common-tags");
const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"];
let Connect4Command = class Connect4Command extends Command_1.default {
    async exec(msg, { opponent }) {
        const message = await msg.channel.send(msg.guild.loc.get("COMMAND_GAME_LIST_PREPARING"));
        for (const num of numbers)
            await message.react(num);
        const c4 = new Connect4_1.default();
        while (!c4.isEnd()) {
            const user = c4.turn ? msg.author : opponent;
            await message.edit(common_tags_1.stripIndents `
                <:connect4:745791911218118706> **| ${msg.guild.loc.get("COMMAND_GAME_LIST_TURN", user)}**
                > ${c4.toString().replace(/\n/g, "\n> ")}
                > ${numbers.join("")}
            `);
            if (user.bot) {
                await discord_js_1.Util.delayFor(1000);
                c4.placeAI(5);
                continue;
            }
            const filter = (m, usr) => usr.id === user.id
                && numbers.includes(m.emoji.name)
                && c4.canPlace(numbers.indexOf(m.emoji.name));
            const responses = await message.awaitReactions(filter, { max: 1, time: 30000 });
            if (!responses.size) {
                c4.giveUp();
                break;
            }
            const index = numbers.indexOf(responses.first().emoji.name);
            c4.place(index);
        }
        return message.edit(common_tags_1.stripIndents `
            ${msg.guild.loc.get(c4.winner ? "COMMAND_GAME_LIST_CONGRATS" : "COMMAND_GAME_LIST_DRAW", c4.turn ? msg.author : opponent)}
            > ${c4.toString().replace(/\n/g, "\n> ")}
            > ${numbers.join("")}
        `);
    }
};
__decorate([
    decorators_1.verifyWantChallange("opponent", true)
], Connect4Command.prototype, "exec", null);
Connect4Command = __decorate([
    decorators_1.DeclareCommand("game-connect4", {
        aliases: [],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_GAME_CONNECT4_DESCRIPTION"),
            usage: "<user>",
            examples: ["game-conmect4"],
            adionalInfo: ["<:connect4:745791911218118706> Connect4", "connect4", "c4"]
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
], Connect4Command);
exports.default = Connect4Command;
