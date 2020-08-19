import { chunk } from "../../util/Util";

interface TicTacToeToStringPayload {
    sign: [string, string];
    winSign: [string, string];
    numbers: [string, string, string, string, string, string, string, string, string];
    separator: string;
}

export default class TicTacToe {
    public board = chunk(new Array(9).fill(0).map((_, i) => String(i + 1)), 3);
    public end = false;
    public winner?: string;
    public solutions: [number, number][][] = [];
    public turn = true; // true: player 1, false: player 2
    public moves: [number, number][] = [];

    public isEnd(): boolean {
        return this.end;
    }

    public place(x: number, y: number): void {
        this.board[x][y] = this.turn ? "X" : "O";
        this.moves.push([x, y]);
        if (this.isWin()) {
            this.end = true;
            this.winner = this.turn ? "X" : "O";
        }
        if (this.moves.length > 8) this.end = true;
        if (!this.isEnd()) this.turn = !this.turn;
    }

    public canPlace(x: number, y: number): boolean {
        if (!this.board[x] || !this.board[x][y]) return false;
        return !["X", "O"].includes(this.board[x][y]);
    }

    public parsePosition(position: number): [number, number] {
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
            this.solutions.push([[0, 2], [1, 1], [2, 0]]);
            result = true;
        }
        return result;
    }

    public duplicate(): TicTacToe {
        const result = new TicTacToe();
        for (const [x, y] of this.moves) result.place(x, y);
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

    public giveUp(): void {
        this.winner = this.turn ? "O" : "X";
        this.end = true;
    }

    public placeAI(depth = 10): void {
        const moves: { position: [number, number]; rate: number }[] = [];
        for (let i = 1; i < 10; i++) {
            const position = this.parsePosition(i);
            if (!this.canPlace(...position)) continue;
            const rate = this.doComplicatedThing(this.duplicate(), this.turn ? "X" : "O", position, depth);
            moves.push({ position, rate });
        }
        const { rate: bestRate } = moves.sort((a, b) => b.rate - a.rate)[0];
        const bestMoves = moves.filter(x => x.rate === bestRate);
        this.place(...bestMoves[Math.floor(Math.random() * bestMoves.length)].position);
    }

    // Sometime just make stupid rate
    private doComplicatedThing(ttt: TicTacToe, turn: string, position: [number, number], depth: number, curDepth = 0): number {
        if (curDepth > depth) return 0;
        ttt.place(...position);
        if (ttt.end) return ttt.winner ? (ttt.winner === turn ? 1 : -1) : 0;
        let result = 0;
        for (let i = 1; i < 10; i++) {
            const post = this.parsePosition(i);
            if (!ttt.canPlace(...post)) continue;
            const duplicated = ttt.duplicate();
            const res = ttt.doComplicatedThing(duplicated, turn, post, depth, curDepth + 1);
            result += res;
        }
        return result;
    }
}