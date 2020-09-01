import Command from "@yumeko/classes/Command";
import TicTacToe from "@yumeko/classes/Games/TicTacToe";
import { Message, User, MessageReaction, Util } from "discord.js";
import { DeclareCommand, verifyWantChallange } from "@yumeko/decorators";
import { stripIndents } from "common-tags";

const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

interface UpdateBoardReturn {
    isWin: boolean;
    board: string[][];
}

@DeclareCommand("game-tictactoe", {
    aliases: [],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_GAME_TICTACTOE_DESCRIPTION"),
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
export default class TicTacToeCommand extends Command {
    @verifyWantChallange("opponent", true)
    public async exec(msg: Message, { opponent }: { opponent: User }): Promise<Message> {
        const message = await msg.channel.send(msg.guild!.loc.get("COMMAND_GAME_LIST_PREPARING"));
        for (const num of numbers) await message.react(num);
        const ttt = new TicTacToe();
        while (!ttt.isEnd()) {
            const user = ttt.turn ? msg.author : opponent;
            await message.edit(stripIndents`
                <:tictactoe:736370109073063946> **| ${msg.guild!.loc.get("COMMAND_GAME_LIST_TURN", user)}**
                > ${ttt.toString().replace(/\n/g, "\n> ")}
            `);
            if (user.bot) {
                await Util.delayFor(1000);
                ttt.placeAI(8);
                continue;
            }
            const filter = (m: MessageReaction, usr: User): boolean => numbers.includes(m.emoji.name)
                &&  usr.id === user.id
                && ttt.canPlace(...ttt.parsePosition(numbers.indexOf(m.emoji.name) + 1));
            const responses = await message.awaitReactions(filter, { max: 1, time: 30000 });
            if (!responses.size) {
                ttt.giveUp();
                break;
            }
            const index = numbers.indexOf(responses.first()!.emoji.name);
            ttt.place(...ttt.parsePosition(index + 1));
        }
        return message.edit(stripIndents`
        ${msg.guild!.loc.get(ttt.winner ? "COMMAND_GAME_LIST_CONGRATS" : "COMMAND_GAME_LIST_DRAW", ttt.turn ? msg.author : opponent)}
            > ${ttt.toString().replace(/\n/g, "\n> ")}
        `);
    }
}
