import { User } from "discord.js";
import { shuffle } from "@yumeko/util/Util";

export default class Uno {
    public deck: Card[] = [];
    public usedCards: Card[] = [];
    public players: Player[] = [];
    public drawCount = 1;

    public get currentCard(): Card {
        return this.usedCards[0];
    }

    public get currentPlayer(): Player {
        return this.players[0];
    }

    public get isEnd(): boolean {
        return this.players.every(x => x.isUNO);
    }

    public constructor(users: User[], public deckAmount = 2) {
        this.createDeck();
        this.createPlayers(users);
        const card = this.deck.filter(x => !["WILD", "WILD+4", "REVERSE", "SKIP", "REVERSE", "+2"].includes(x.value))[0];
        this.usedCards.push(...this.deck.splice(this.deck.indexOf(card), 1));
    }

    public hit(cards: string[], color?: string): string | void {
        const illegalCards: string[] = [];
        const [colr, value] = [cards[0].charAt(0), cards[0].slice(1)];
        const isWild = cards[0].includes("WILD");
        if (cards.length > 1 && !cards.every(x => x.slice(1) === value)) return "Multiple hit only work if all cards is in the same value";
        for (const card of cards) {
            if (this.currentPlayer.cards.some(x => x.display === card)) continue;
            illegalCards.push(card);
        }
        if (illegalCards.length) return `\`${illegalCards.join(", ")}\` doesn't exist in your hand`;
        if (!this.currentCard.wild && !isWild
            && (colr !== this.currentCard.color.name && value !== this.currentCard.value))
            return "The Color or the value isn't matched with current card";
        if (isWild && !color) return "Color is required if you want to use wild card";
        if (cards[0].includes("+4")) this.drawCount += 4;
        else if (value === "+2") this.drawCount += 2;
        else this.drawCount = 1;
        for (const card of cards) {
            const index = this.currentPlayer.cards.map(x => x.display).indexOf(card);
            this.currentPlayer.point--;
            this.usedCards.unshift(...this.currentPlayer.cards.splice(index, 1));
        }
        if (isWild) this.currentCard.color.name = colr;
        this.userIsUNO();
        this.switchTurn();
    }

    public draw(): string | void {
        if (!this.deck.length) {
            this.deck.push(...this.usedCards);
            this.usedCards = [];
        }
        if (!this.deck.length) return "Deck is empty";
        this.currentPlayer.cards.push(...this.deck.splice(0, this.drawCount));
        this.switchTurn();
    }

    public switchTurn(): void {
        this.players.unshift(this.players.pop()!);
    }

    public giveUp(): void {
        this.currentPlayer.isGiveup = true;
        this.deck.push(...this.currentPlayer.cards);
        this.currentPlayer.cards = [];
        this.userIsUNO();
        this.switchTurn();
    }

    private userIsUNO (): boolean {
        return this.currentPlayer.isUNO = !this.currentPlayer.cards.length;
    }

    private createPlayers(users: User[]): Player[] {
        const point = this.deck.length;
        for (const user of users)
            this.players.push({
                user, point,
                isUNO: false,
                isGiveup: false,
                cards: this.deck.splice(0, 7)
            });
        return this.players;
    }

    private createDeck(): Card[] {
        const specialCards = ["WILD", "WILD+4"];
        const values = [...new Array(10).fill(0).map((_, i) => String(i)), ...specialCards, "SKIP", "REVERSE", "+2"];
        const colors: [string, number][] = [["R", 0xFF0000], ["Y", 0xFFFF00], ["G", 0x00FF00], ["B", 0x0000FF]];
        for (const [color, hex] of colors) {
            for (const value of values) {
                for (let i = 0; i < this.deckAmount; i++) {
                    const wild = specialCards.includes(value);
                    const display = wild ? value : `${color}${value}`;
                    this.deck.push({
                        value, display, wild,
                        color: {
                            name: wild ? "" : color,
                            hex: wild ? 0x000000 : hex
                        }
                    });
                }
            }
        }
        this.deck = shuffle(this.deck);
        return this.deck;
    }
}

interface Card {
    value: string;
    display: string;
    color: {
        name: string;
        hex: number;
    };
    wild: boolean;
}

interface Player {
    user: User;
    point: number;
    isUNO: boolean;
    isGiveup: boolean;
    cards: Card[];
}