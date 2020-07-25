import type YumekoClient from "../../../classes/Client";
import Command from "../../../classes/Command";
import type { Message, User, MessageReaction } from "discord.js";
import { stripIndents } from "common-tags";
import { chunk, verify } from "../../../util/Util";

const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

interface UpdateBoardReturn {
    isWin: boolean;
    board: string[][];
}

export default class TicTacToeCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "game-tictactoe", {
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
                    prompt: "Which user do you want to challenge ?"
                }
            ]
        });
    }

    public async exec(msg: Message, { opponent }: { opponent: User }): Promise<Message> {
        const verifyMsg = await msg.channel.send(`❓ **| ${opponent}, Do you want accept this challenge ?**`);
        const verified = await verify(verifyMsg, opponent);
        if (!verified) return msg.ctx.send(`🍃 **| Look like ${opponent} doesn't accept your challenge**`);
        const selected: string[] = [];
        let board = chunk(numbers, 3);
        let turn = true;
        let passes = 0;
        let winner: User|void;
        const message = await msg.channel.send("🖌️ **| Preparing**");
        for (const num of numbers) await message.react(num);
        while (!winner && passes < 9) {
            const user = turn ? msg.author : opponent;
            await message.edit(stripIndents`
                <:tictactoe:736370109073063946> **| ${user}, Turn!**
                > ${board.map(x => x.join("")).join("\n> ")}
            `);
            const filter = (m: MessageReaction, usr: User): boolean => numbers.includes(m.emoji.name)
                &&  usr.id === user.id
                && !selected.includes(m.emoji.name);
            const responses = await message.awaitReactions(filter, { max: 1, time: 30000 });
            if (!responses.size) {
                winner = turn ? opponent : msg.author;
                break;
            }
            const index = numbers.indexOf(responses.first()!.emoji.name);
            const [line, column] = this.getIndexs(index);
            selected.push(numbers[index]);
            board[line][column] = turn ? "❌" : "⭕";
            const check = this.updateBoard(board, turn ? "❎": "🅾");
            board = check.board;
            if (check.isWin) winner = user;
            turn = !turn;
            passes++;
        }
        return message.edit(stripIndents`
            ${winner ? `🎉 **| Congrats ${winner}, you win the match!**` : "🇴 **| Draw!**"}
            > ${board.map(x => x.join("")).join("\n> ")}
        `);
    }

    public getIndexs(num: number): [number, number] {
        return [
            Math.floor(num/3),
            num%3
        ];
    }
    public updateBoard (board: string[][], checkSign: string): UpdateBoardReturn {
        let result: UpdateBoardReturn = { isWin: false, board };
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][0] === board[i][2]){
                board[i][0] = checkSign;
                board[i][1] = checkSign;
                board[i][2] = checkSign;
                result = { board, isWin: true };
            }
            if (board[0][i] === board[1][i] && board[0][i] === board[2][i]){
                board[0][i] = checkSign;
                board[1][i] = checkSign;
                board[2][i] = checkSign;
                result = { board, isWin: true };
            }
        }
        if (board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            board[0][0] = checkSign;
            board[1][1] = checkSign;
            board[2][2] = checkSign;
            result = { board, isWin: true };
        }
        if (board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            board[0][2] = checkSign;
            board[1][1] = checkSign;
            board[2][0] = checkSign;
            result = { board, isWin: true };
        }
        return result;
    }
}