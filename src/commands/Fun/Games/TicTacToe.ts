import Command from "../../../classes/Command";
import TicTacToe from "../../../classes/Games/TicTacToe";
import CustomError from "../../../classes/CustomError";
import { Message, User, MessageReaction, Util } from "discord.js";
import { DeclareCommand } from "../../../decorators";
import { stripIndents } from "common-tags";
import { verify } from "../../../util/Util";

const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

interface UpdateBoardReturn {
    isWin: boolean;
    board: string[][];
}

@DeclareCommand("game-tictactoe", {
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
export default class TicTacToeCommand extends Command {
    public async exec(msg: Message, { opponent }: { opponent?: User }): Promise<Message> {
        if (opponent) {
            const verifyMsg = await msg.channel.send(`❓ **| ${opponent}, Do you want accept this challenge ?**`);
            const verified = await verify(verifyMsg, opponent);
            if (!verified) {
                await verifyMsg.edit(`🍃 **| Look like ${opponent} doesn't accept your challenge. Do you want to play it with me anyway ?**`);
                const accept = await verify(verifyMsg, msg.author);
                if (!accept) {
                    msg.ctx.send("✋ **| Ok see you next time**");
                    throw new CustomError("CANCELED");
                }
                opponent = this.client.user!;
            }
        } else opponent = this.client.user!;
        const message = await msg.channel.send("🖌️ **| Preparing**");
        for (const num of numbers) await message.react(num);
        const ttt = new TicTacToe();
        while (!ttt.isEnd()) {
            const user = ttt.turn ? msg.author : opponent;
            await message.edit(stripIndents`
                <:tictactoe:736370109073063946> **| ${user}, Turn!**
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
            ${ttt.winner ? `🎉 **| Congrats ${ttt.turn ? msg.author : opponent}, you win the match!**` : "🇴 **| Draw!**"}
            > ${ttt.toString().replace(/\n/g, "\n> ")}
        `);
    }
}
