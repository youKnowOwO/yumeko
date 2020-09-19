import Command from "@yumeko/classes/Command";
import Connect4 from "@yumeko/classes/Games/Connect4";
import { Message, MessageReaction, User, Util } from "discord.js";
import { DeclareCommand, verifyWantChallange } from "@yumeko/decorators";
import { stripIndents } from "common-tags";

const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"];

@DeclareCommand("game-connect4", {
    aliases: [],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_GAME_CONNECT4_DESCRIPTION"),
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
export default class extends Command {
    @verifyWantChallange("opponent", true)
    public async exec(msg: Message, { opponent }: { opponent: User }): Promise<Message> {
        const message = await msg.channel.send(msg.guild!.loc.get("COMMAND_GAME_LIST_PREPARING"));
        for (const num of numbers) await message.react(num);
        const c4 = new Connect4();
        while(!c4.isEnd()) {
            const user = c4.turn ? msg.author : opponent;
            await message.edit(stripIndents`
                <:connect4:745791911218118706> **| ${msg.guild!.loc.get("COMMAND_GAME_LIST_TURN", user)}**
                > ${c4.toString().replace(/\n/g, "\n> ")}
                > ${numbers.join("")}
            `);
            if (user.bot) {
                await Util.delayFor(1000);
                c4.placeAI(5);
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
            ${msg.guild!.loc.get(c4.winner ? "COMMAND_GAME_LIST_CONGRATS" : "COMMAND_GAME_LIST_DRAW", c4.turn ? msg.author : opponent)}
            > ${c4.toString().replace(/\n/g, "\n> ")}
            > ${numbers.join("")}
        `);
    }
}