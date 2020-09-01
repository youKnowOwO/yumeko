import Command from "@yumeko/classes/Command";
import type { Message, User } from "discord.js";
import { DeclareCommand } from "@yumeko/decorators";
import { Canvas, resolveImage } from "canvas-constructor";

@DeclareCommand("ship", {
    aliases: ["ship"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_SHIP_DESCRIPTION"),
        usage: "ship <user> [user] [shipname]",
        examples: ["ship @unknown"]
    },
    category: "fun",
    args: [
        {
            identifier: "userOne",
            match: "single",
            type: "user",
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_SHIP_PROMPT")
        },
        {
            identifier: "userTwo",
            match: "single",
            type: "user",
            optional: true
        },
        {
            identifier: "shipname",
            match: "rest",
            type: "string",
            optional: true
        }
    ]
})
export default class ShipCommand extends Command {
    public async exec(msg: Message, { userOne, userTwo }: { userOne: User; userTwo?: User }): Promise<Message> {
        if (!userTwo) {
            userTwo = userOne;
            userOne = msg.author;
        }
        const m = await msg.channel.send(msg.guild!.loc.get("COMMAND_FUN_PAINTING"));
        const userOneAvatar = await resolveImage(userOne.displayAvatarURL({ format: "png", size: 512 }));
        const userTwoAvatar = await resolveImage(userTwo.displayAvatarURL({ format: "png", size: 512 }));
        const attachment = await new Canvas(1024, 524)
            .printImage(userOneAvatar, 0, 0, 512, 512)
            .printImage(userTwoAvatar, 512, 0, 512, 512)
            .toBufferAsync();
        m.delete();
        return msg.ctx.send(`❤️ **| ${this.getShipName(userOne.username, userTwo.username)} \`${Math.floor(Math.random() * 100)}%\`**`, { files: [{ attachment, name: "ship.png"}]});
    }

    public getShipName(username1: string, username2: string): string {
        return [this.getFirstPron(username1), this.getFirstPron(username2)].join("");
    }

    private getFirstPron(letter: string): string {
        const vocals = ["a", "i", "u", "e", "o"];
        let result = "";
        for(const wd of letter.split("")) {
            result += wd;
            if (vocals.includes(wd.toLocaleLowerCase())) break;
        }
        if (result !== letter) return result;
        return letter.substr(0, letter.length / 2);
    }
}