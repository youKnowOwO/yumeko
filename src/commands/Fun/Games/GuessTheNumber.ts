import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import CustomError from "@yumeko/classes/CustomError";
import type { Message } from "discord.js";

export default class extends Command {
    public constructor (client: YumekoClient) {
        super(client, "game-guessthenumber", {
            aliases: [],
            description: {
                content: (msg): string => msg.guild!.loc.get("COMMAND_GAME_GUESS_THE_NUMBER_DESCRIPTION"),
                usage: "[range]",
                examples: ["game-guessthenumber"],
                adionalInfo: ["❓ Guess The Number", "gtn", "hilo"]
            },
            category: "fun",
            args: [
                {
                    identifier: "thatNumber",
                    match: "single",
                    default: "1-100",
                    type: (_: Message, content: string): number => {
                        if (!content.includes("-")) throw new CustomError("!PARSING", "**Invalid input, right input `min-max`**");
                        const typeNumber = this.collector.runner.argsParser.getType("number")!;
                        const numbers: number[] = [];
                        for (const num of content.split("-")) {
                            numbers.push(typeNumber(_, num) as any);
                        }
                        if (numbers[0] < 1) throw new CustomError("!PARSING", "Minimum range is `1` or higher");
                        if (numbers[1] > 1000) throw new CustomError("!PARSING", "Maximume value is `1000` or shorter");
                        if ((numbers[1] - numbers[0]) < 10) throw new CustomError("!PARSING", "Your range is too short!");
                        return this.randomNumber(numbers[0], numbers[1]);
                    }
                }
            ]
        });
    }

    public async exec(msg: Message, { thatNumber }: { thatNumber: number }): Promise<Message> {
        let toSend = msg.guild!.loc.get("COMMAND_GAME_GUESS_THE_NUMBER_START");
        let guessed = false;
        let chance = 10;
        while (!guessed && chance > 0) {
            await msg.channel.send(toSend);
            const filter = (m: Message): boolean => !isNaN(Number(m.content)) && msg.author.id === m.author.id;
            const responses = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });
            if (!responses.size) {
                await msg.channel.send(msg.guild!.loc.get("COMMAND_GAME_LIST_TIMEOUT"));
                break;
            }
            const num = parseInt(responses.first()!.content, 10);
            if (num < thatNumber) toSend = msg.guild!.loc.get("COMMAND_GAME_GUESS_THE_NUMBER_HIGHER", num);
            else if (num > thatNumber) toSend = msg.guild!.loc.get("COMMAND_GAME_GUESS_THE_NUMBER_SHORTER", num);
            else guessed = true;
            chance--;
        }
        if (!guessed) return msg.ctx.send(msg.guild!.loc.get("COMMAND_GAME_LIST_WRONG", thatNumber));
        return msg.ctx.send(msg.guild!.loc.get("COMMAND_GAME_LIST_RIGHT", thatNumber));
    }

    public randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}