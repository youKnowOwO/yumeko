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
const Minesweeper_1 = __importDefault(require("@yumeko/classes/Games/Minesweeper"));
const decorators_1 = require("@yumeko/decorators");
const common_tags_1 = require("common-tags");
const alphabets = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫"];
const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
let default_1 = class extends Command_1.default {
    async exec(msg) {
        const message = await msg.channel.send("🖌️ Preparing...");
        for (const alphabet of alphabets)
            await message.react(alphabet);
        for (const num of numbers)
            await message.react(num);
        const minesweeper = new Minesweeper_1.default();
        let isFlag = false;
        const flagListener = message.createReactionCollector((react, usr) => react.emoji.name === "🚩" && !!minesweeper.board.length && usr.id === msg.author.id)
            .on("collect", () => {
            isFlag = !isFlag;
            message.edit(common_tags_1.stripIndents `
                    💣 **| Minesweeper**
                    > ${isFlag ? "🚩" : "⬛"}${alphabets.map((_, i) => `:regional_indicator_${String.fromCharCode(97 + i)}:`).join("")}
                    ${minesweeper.toString().split("\n").map((x, i) => `> ${numbers[i]}${x}`).join("\n")}
                `);
        });
        while (!minesweeper.isEnd()) {
            await message.edit(common_tags_1.stripIndents `
                💣 **| Minesweeper**
                > ${isFlag ? "🚩" : "⬛"}${alphabets.map((_, i) => `:regional_indicator_${String.fromCharCode(97 + i)}:`).join("")}
                ${minesweeper.toString().split("\n").map((x, i) => `> ${numbers[i]}${x}`).join("\n")}
            `);
            let alphaSelect = true;
            const filter = (react, usr) => {
                if (usr.id !== msg.author.id)
                    return false;
                if (!(alphaSelect ? alphabets : numbers).includes(react.emoji.name))
                    return false;
                alphaSelect = !alphaSelect;
                return true;
            };
            const responses = await message.awaitReactions(filter, { max: 2, time: 30000 });
            if (!responses.size)
                break;
            const [col, line] = responses.map(x => alphabets.includes(x.emoji.name) ? alphabets.indexOf(x.emoji.name) : numbers.indexOf(x.emoji.name));
            minesweeper[isFlag ? "flag" : "dig"](line, col);
            if (minesweeper.board.length)
                await message.react("🚩");
        }
        flagListener.stop();
        return message.edit(common_tags_1.stripIndents `
            ${msg.ctx.lang(minesweeper.isEnd() ? (minesweeper.isDoughBomb ? "COMMAND_GAME_MINESWEEPER_DOUGH_BOMB" : "COMMAND_GAME_MINESWEEPER_WIN") : "COMMAND_GAME_LIST_TIMEOUT")}
            > ⬛${alphabets.map((_, i) => `:regional_indicator_${String.fromCharCode(97 + i)}:`).join("")}
            ${minesweeper.toString().split("\n").map((x, i) => `> ${numbers[i]}${x}`).join("\n")}
        `);
    }
};
default_1 = __decorate([
    decorators_1.DeclareCommand("game-minesweeper", {
        aliases: [],
        description: {
            content: (msg) => msg.ctx.lang("COMMAND_GAME_MINESWEEPER_DESCRIPTION"),
            usage: "",
            examples: ["game-minesweeper"],
            adionalInfo: ["💣 Minesweeper", "minesweeper", "mnswpr"]
        },
        category: "fun"
    })
], default_1);
exports.default = default_1;
