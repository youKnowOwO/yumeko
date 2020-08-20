import Command from "../../../classes/Command";
import CustomError from "../../../classes/CustomError";
import Connect4 from "../../../classes/Games/Connect4";
import { Message, MessageReaction, User } from "discord.js";
import { DeclareCommand } from "../../../decorators";
import { verify } from "../../../util/Util";
import { stripIndents } from "common-tags";

const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"];

@DeclareCommand("game-connect4", {
    aliases: [],
    description: {
        content: "Play Connect4 game with other user. This is solved game, you must drop 4 marks horizontal vertical or diagonal to win the match.",
        usage: "<user>",
        examples: ["game-conmect4"],
        adionalInfo: ["<:connect4:745791911218118706> Connect4", "connect4", "c4"]
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
export default class Connect4Command extends Command {
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
        const c4 = new Connect4();
        while(!c4.isEnd()) {
            const user = c4.turn ? msg.author : opponent;
            await message.edit(stripIndents`
                <:connect4:745791911218118706> **| ${user}, Turn!**
                > ${c4.toString().replace(/\n/g, "\n> ")}
                > ${numbers.join("")}
            `);
            if (user.bot) {
                c4.placeAI();
                continue;
            }
            const filter = (m: MessageReaction, usr: User): boolean => usr.id === user.id
                && numbers.includes(m.emoji.name)
                && c4.canPlace(numbers.indexOf(m.emoji.name));
            const responses = await message.awaitReactions(filter, { max: 1, time: 30000 });
            if (!responses.size) {
                c4.giveUp();
                break;
            }
            const index = numbers.indexOf(responses.first()!.emoji.name);
            c4.place(index);
        }
        return message.edit(stripIndents`
            ${c4.winner ? `🎉 **| Congrats ${c4.turn ? msg.author : opponent}, you win the match!**` : "🇴 **| Draw!**"}
            > ${c4.toString().replace(/\n/g, "\n> ")}
            > ${numbers.join("")}
        `);
    }
}