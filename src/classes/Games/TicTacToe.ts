import { chunk } from "../../util/Util";

interface TicTacToeToStringPayload {
    sign: [string, string];
    winSign: [string, string];
    numbers: [string, string, string, string, string, string, string, string, string];
    separator: string;
}

export default class TicTacToe {
    public board = chunk(new Array(9).fill(0).map((_, i) => String(i + 1)), 3);
    public isEnd = false;
    public winner?: string;
    public solutions: [number, number][][] = [];
    public turn = true; // true: player 1, false: player 2
    public moves: [number, number][] = [];

    public place(x: number, y: number): void {
        this.board[x][y] = this.turn ? "X" : "O";
        this.moves.push([x, y]);
        if (this.isWin()) {
            this.isEnd = true;
            this.winner = this.turn ? "X" : "O";
        }
        if (this.moves.length > 9) this.isEnd = true;
        this.turn = !this.turn;
    }

    public canPlace(x: number, y: number): boolean {
        if (!this.board[x] || !this.board[x][y]) return false;
        return !["X", "O"].includes(this.board[x][y]);
    }

    public parsePosition(position: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): [number, number] {
        position--;
        return [
            Math.floor(position/3),
            position%3
        ];
    }

    public isWin(): boolean {
        let result = false;
        for (let i = 0; i < 3; i++) {
            if (this.board[0][i] === this.board[1][i] && this.board[0][i] === this.board[2][i]) {
                this.solutions.push([[0, i], [1, i], [2, i]]);
                result = true;
            }
            if (this.board[i][0] === this.board[i][1] && this.board[i][0] === this.board[i][2]) {
                this.solutions.push([[i, 0], [i, 1], [i, 2]]);
                result = true;
            }
        }
        if (this.board[0][0] === this.board[1][1] && this.board[0][0] === this.board[2][2]) {
            this.solutions.push([[0, 0], [1, 1], [2, 2]]);
            result = true;
        }
        if (this.board[0][2] === this.board[1][1] && this.board[0][2] === this.board[2][0]) {
            this.solutions.push([[0, 2], [1, 1], [0, 2]]);
            result = true;
        }
        return result;
    }

    public toString(payload?: TicTacToeToStringPayload): string {
        if (!payload) payload = {
            sign: ["❌", "⭕"],
            winSign: ["❎", "🅾️"],
            numbers: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
            separator: ""
        };
        const display = this.board.map(x =>
            x.map(y => {
                const index = parseInt(y, 10);
                if (!isNaN(index)) return payload!.numbers[index - 1];
                return payload!.sign[["X", "O"].indexOf(y)];
            })
        );
        if (this.winner) {
            for (const solution of this.solutions)
                for (const [x, y] of solution)
                    display[x][y] = payload.winSign[ ["X", "O"].indexOf(this.winner)];
        }
        return display.map(x => x.join(payload!.separator)).join("\n");
    }
}