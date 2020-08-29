"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("@yumeko/util/Util");
class Minesweeper {
    constructor() {
        this.board = [];
        this.isDoughBomb = false;
        this.isFirstMove = true;
        this.digCount = 0;
        this.bombCount = 0;
    }
    flag(x, y) {
        return this.board[x][y].isFlaged = !this.board[x][y].isFlaged;
    }
    isEnd() {
        if (this.isDoughBomb)
            return true;
        return this.digCount > 35 - this.bombCount;
    }
    parsePosition(input) {
        const [col, line] = input.toLowerCase().split("");
        return [parseInt(line, 10), col.charCodeAt(0) - 97];
    }
    canDig(x, y) {
        if (x > 6 || y > 6)
            return false;
        return !this.board[x][y].isDough;
    }
    toString(payload) {
        if (!payload)
            payload = {
                numbers: ["<:zerobomb:746167475057459281>", "<:onebomb:486677493311471627>", "<:twobomb:486677544817393694>", "<:threebomb:486677629253189632>", "<:fourbomb:486677668381720590>", "<:fivebomb:486677705702506497>", "<:sixbomb:486677776141647872>", "<:sevenbomb:486677830940491786>", "<:eightbomb:486677896216182806>"],
                bomb: "💣",
                empty: "⬜",
                flag: "🚩"
            };
        if (!this.board.length)
            return new Array(6).fill(new Array(6).fill(payload.empty).join("")).join("\n");
        return this.board.map(x => x.map(y => {
            if (this.isDoughBomb && y.isBomb)
                return payload.bomb;
            if (!y.isDough)
                return y.isFlaged ? payload.flag : payload.empty;
            return payload.numbers[y.nearBomb];
        }).join("")).join("\n");
    }
    dig(x, y) {
        if (this.isFirstMove) {
            this.isFirstMove = false;
            this.board = this.createBoard(x, y);
        }
        const floor = this.board[x][y];
        if (floor.isBomb) {
            this.isDoughBomb = true;
            return undefined;
        }
        if (!floor.isDough) {
            floor.isDough = true;
            this.digCount++;
        }
        if (!floor.nearBomb) {
            if (this.board[x][y + 1] && !this.board[x][y + 1].isDough && !this.board[x][y + 1].isBomb)
                this.dig(x, y + 1);
            if (this.board[x][y - 1] && !this.board[x][y - 1].isDough && !this.board[x][y - 1].isBomb)
                this.dig(x, y - 1);
            if (this.board[x + 1]) {
                if (this.board[x + 1][y] && !this.board[x + 1][y].isDough && !this.board[x + 1][y].isBomb)
                    this.dig(x + 1, y);
                if (this.board[x + 1][y + 1] && !this.board[x + 1][y + 1].isDough && !this.board[x + 1][y + 1].isBomb)
                    this.dig(x + 1, y + 1);
                if (this.board[x + 1][y - 1] && !this.board[x + 1][y - 1].isDough && !this.board[x + 1][y - 1].isBomb)
                    this.dig(x + 1, y - 1);
            }
            if (this.board[x - 1]) {
                if (this.board[x - 1][y] && !this.board[x - 1][y].isDough && !this.board[x - 1][y].isBomb)
                    this.dig(x - 1, y);
                if (this.board[x - 1][y + 1] && !this.board[x - 1][y + 1].isDough && !this.board[x - 1][y + 1].isBomb)
                    this.dig(x - 1, y + 1);
                if (this.board[x - 1][y - 1] && !this.board[x - 1][y - 1].isDough && !this.board[x - 1][y - 1].isBomb)
                    this.dig(x - 1, y - 1);
            }
        }
    }
    createBoard(firstX, firstY, totalBomb = 6) {
        const struct = [];
        for (let i = 0; i < 36; i++)
            struct.push({
                isBomb: i < totalBomb,
                isFlaged: false,
                isDough: false,
                nearBomb: 0
            });
        const result = Util_1.chunk(Util_1.shuffle(struct), 6);
        if (result[firstX][firstY].isBomb)
            result[firstX][firstY].isBomb = false;
        for (let x = 0; x < 6; x++) {
            for (let y = 0; y < 6; y++) {
                if (result[x][y].isBomb) {
                    this.bombCount++;
                    continue;
                }
                if (result[x][y + 1] && result[x][y + 1].isBomb)
                    result[x][y].nearBomb++;
                if (result[x][y - 1] && result[x][y - 1].isBomb)
                    result[x][y].nearBomb++;
                if (result[x + 1]) {
                    if (result[x + 1][y].isBomb)
                        result[x][y].nearBomb++;
                    if (result[x + 1][y + 1] && result[x + 1][y + 1].isBomb)
                        result[x][y].nearBomb++;
                    if (result[x + 1][y - 1] && result[x + 1][y - 1].isBomb)
                        result[x][y].nearBomb++;
                }
                if (result[x - 1]) {
                    if (result[x - 1][y].isBomb)
                        result[x][y].nearBomb++;
                    if (result[x - 1][y + 1] && result[x - 1][y + 1].isBomb)
                        result[x][y].nearBomb++;
                    if (result[x - 1][y - 1] && result[x - 1][y - 1].isBomb)
                        result[x][y].nearBomb++;
                }
            }
        }
        return result;
    }
}
exports.default = Minesweeper;
