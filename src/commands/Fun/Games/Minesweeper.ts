import Command from "@yumeko/classes/Command";
import Minesweeper from "@yumeko/classes/Games/Minesweeper";
import { DeclareCommand } from "@yumeko/decorators";
import type { Message, MessageReaction, User, Collector } from "discord.js";
import { stripIndents } from "common-tags";

const alphabets = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫"];
const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];

@DeclareCommand("game-minesweeper", {
    aliases: [],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_GAME_MINESWEEPER_DESCRIPTION"),
        usage: "",
        examples: ["game-minesweeper"],
        adionalInfo: ["💣 Minesweeper", "minesweeper", "mnswpr"]
    },
    category: "fun"
})
export default class extends Command {
    public async exec(msg: Message): Promise<Message> {
        const message = await msg.channel.send("🖌️ Preparing...");
        for (const alphabet of alphabets) await message.react(alphabet);
        for (const num of numbers) await message.react(num);
        const minesweeper = new Minesweeper();
        let isFlag = false as boolean;
        const flagListener = message.createReactionCollector((react: MessageReaction, usr: User): boolean => react.emoji.name === "🚩" && !!minesweeper.board.length && usr.id === msg.author.id)
            .on("collect", () => {
                isFlag = !isFlag;
                message.edit(stripIndents`
                    💣 **| Minesweeper**
                    > ${isFlag ? "🚩" : "⬛"}${alphabets.map((_, i) => `:regional_indicator_${String.fromCharCode(97 + i)}:`).join("")}
                    ${minesweeper.toString().split("\n").map((x, i) => `> ${numbers[i]}${x}`).join("\n")}
                `);
            });
        while(!minesweeper.isEnd()) {
            await message.edit(stripIndents`
                💣 **| Minesweeper**
                > ${isFlag ? "🚩" : "⬛"}${alphabets.map((_, i) => `:regional_indicator_${String.fromCharCode(97 + i)}:`).join("")}
                ${minesweeper.toString().split("\n").map((x, i) => `> ${numbers[i]}${x}`).join("\n")}
            `);
            let alphaSelect = true;
            const filter = (react: MessageReaction, usr: User): boolean => {
                if (usr.id !== msg.author.id) return false;
                if (!(alphaSelect ? alphabets : numbers).includes(react.emoji.name)) return false;
                alphaSelect = !alphaSelect;
                return true;
            };
            const responses = await message.awaitReactions(filter, { max: 2, time: 30000 });
            if (!responses.size) break;
            const [col, line] = responses.map(x => alphabets.includes(x.emoji.name) ? alphabets.indexOf(x.emoji.name) : numbers.indexOf(x.emoji.name));
            minesweeper[isFlag ? "flag" : "dig"](line, col);
            if (minesweeper.board.length) await message.react("🚩");
        }
        (flagListener as Collector<string, MessageReaction>).stop();
        return message.edit(stripIndents`
            ${msg.guild!.loc.get(minesweeper.isEnd() ? (minesweeper.isDoughBomb ? "COMMAND_GAME_MINESWEEPER_DOUGH_BOMB" : "COMMAND_GAME_MINESWEEPER_WIN") : "COMMAND_GAME_LIST_TIMEOUT")}
            > ⬛${alphabets.map((_, i) => `:regional_indicator_${String.fromCharCode(97 + i)}:`).join("")}
            ${minesweeper.toString().split("\n").map((x, i) => `> ${numbers[i]}${x}`).join("\n")}
        `);
    }
}