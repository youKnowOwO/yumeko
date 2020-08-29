"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("@yumeko/util/Util");
class Connect4 {
    constructor() {
        this.board = Util_1.chunk(new Array(42).fill(""), 7);
        this.end = false;
        this.solutions = [];
        this.turn = true;
        this.moves = [];
    }
    isEnd() {
        return this.end;
    }
    place(col) {
        for (let i = 5; i >= 0; i--) {
            if (!this.board[i][col].length) {
                this.board[i][col] = this.turn ? "O" : "0";
                this.moves.push(col);
                break;
            }
        }
        if (this.isWin()) {
            this.end = true;
            this.winner = this.turn ? "O" : "0";
        }
        if (this.moves.length > 41)
            this.end = true;
        if (!this.isEnd())
            this.turn = !this.turn;
    }
    canPlace(col) {
        for (let i = 5; i >= 0; i--) {
            if (!this.board[i][col].length)
                return true;
        }
        return false;
    }
    isWin() {
        const sign = this.turn ? "O" : "0";
        let result = false;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === sign && this.board[i][j + 1] === sign && this.board[i][j + 2] === sign && this.board[i][j + 3] === sign) {
                    this.solutions.push([[i, j], [i, j + 1], [i, j + 2], [i, j + 3]]);
                    result = true;
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 7; j++) {
                if (this.board[i][j] === sign && this.board[i + 1][j] === sign && this.board[i + 2][j] === sign && this.board[i + 3][j] === sign) {
                    this.solutions.push([[i, j], [i + 1, j], [i + 2, j], [i + 3, j]]);
                    result = true;
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === sign && this.board[i + 1][j + 1] === sign && this.board[i + 2][j + 2] === sign && this.board[i + 3][j + 3] === sign) {
                    this.solutions.push([[i, j], [i + 1, j + 1], [i + 2, j + 2], [i + 3, j + 3]]);
                    result = true;
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 3; j < 7; j++) {
                if (this.board[i][j] === sign && this.board[i + 1][j - 1] === sign && this.board[i + 2][j - 2] === sign && this.board[i + 3][j - 3] === sign) {
                    this.solutions.push([[i, j], [i + 1, j - 1], [i + 2, j - 2], [i + 3, j - 3]]);
                    result = true;
                }
            }
        }
        return result;
    }
    duplicate() {
        const result = new Connect4();
        for (const move of this.moves)
            result.place(move);
        return result;
    }
    toString(payload) {
        if (!payload)
            payload = {
                sign: ["🔴", "🔵"],
                winSign: ["🅾️", "🇴"],
                emptySign: "⚪",
                separator: ""
            };
        const display = this.board.map(x => x.map(y => payload.sign[["O", "0"].indexOf(y)] || payload.emptySign));
        if (this.winner) {
            for (const solution of this.solutions)
                for (const [x, y] of solution)
                    display[x][y] = payload.winSign[["O", "0"].indexOf(this.winner)];
        }
        return display.map(x => x.join(payload.separator)).join("\n");
    }
    giveUp() {
        this.turn = !this.turn;
        this.winner = this.turn ? "O" : "0";
        this.end = true;
    }
    placeAI(depth = 4) {
        const moves = [];
        for (let i = 0; i < 7; i++) {
            if (!this.canPlace(i))
                continue;
            const duplicated = this.duplicate();
            const rate = this.doComplicatedThing(duplicated, i, this.turn ? "O" : "0", depth);
            moves.push({ col: i, rate });
        }
        const bestRate = Math.max(...moves.map(x => x.rate));
        const bestMoves = moves.filter(x => x.rate === bestRate);
        this.place(bestMoves[Math.floor(Math.random() * bestMoves.length)].col);
    }
    doComplicatedThing(c4, col, turn, depth, curentDepth = 0, maximize = false) {
        if (curentDepth > depth)
            return 0;
        c4.place(col);
        if (c4.end)
            return c4.winner ? (c4.winner === turn ? 1 : -1) : 0;
        let result = maximize ? -Infinity : Infinity;
        for (let i = 0; i < 7; i++) {
            if (!c4.canPlace(i))
                continue;
            const duplicated = c4.duplicate();
            const res = c4.doComplicatedThing(duplicated, i, turn, depth, curentDepth + 1, !maximize);
            result = Math[maximize ? "max" : "min"](result, res);
        }
        return result;
    }
}
exports.default = Connect4;
