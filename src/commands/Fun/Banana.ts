import Command from "@yumeko/classes/Command";
import type { Message, GuildMember } from "discord.js";
import { DeclareCommand } from "@yumeko/decorators";
import { Canvas, resolveImage } from "canvas-constructor";
import { join } from "path";

@DeclareCommand("banana", {
    aliases: ["banana", "banana-length"],
    description: {
        content:(msg): string => msg.guild!.loc.get("COMMAND_BANANA_DESCRIPTION"),
        usage: "banana [user]",
        examples: ["banana", "banana @unknown"]
    },
    category: "fun",
    args: [
        {
            identifier: "user",
            match: "rest",
            type: "member",
            optional: true
        }
    ]
})
export default class BananaCommand extends Command {
    public async exec(msg: Message, { member }: { member?: GuildMember }): Promise<Message> {
        if (!member) member = msg.member!;
        const length = Math.floor(Math.random() * 15) + 5;
        const attachment = await this.makeImage(length);
        return msg.ctx.send(msg.guild!.loc.get("COMMAND_BANANA_LENGTH", member, length), { files: [{ attachment, name: "banana.jpg" }]});
    }

    public async makeImage(length: number): Promise<Buffer> {
        const path = join(__dirname, "../../../assets/images/banana.png");
        const base = await resolveImage(path);
        const diff = length / 20;
        const bananaImage = await resolveImage(await new Canvas(500, 333).printImage(base, 0, 0).toBufferAsync());
        return new Canvas(500, 353)
            .printImage(base, 0, 0)
            .setColor("white")
            .printRectangle(0, 0, 500, 333)
            .printImage(bananaImage, 500 - (500 * diff), 333 - (333 * diff), 500 * diff, 333 * diff)
            .toBufferAsync();
    }
}