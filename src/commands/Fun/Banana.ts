import Command from "@yumeko/classes/Command";
import type { Message, GuildMember } from "discord.js";
import type { Image } from "canvas";
import { DeclareCommand, hide, constantly } from "@yumeko/decorators";
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
export default class extends Command {
    @hide
    private base?: Image;

    @hide
    private bananaImage?: unknown;

    @constantly
    public async exec(msg: Message, { member }: { member?: GuildMember }): Promise<Message> {
        if (!member) member = msg.member!;
        const length = Math.floor(Math.random() * 15) + 5;
        const attachment = await this.makeImage(length);
        return msg.ctx.send(msg.guild!.loc.get("COMMAND_BANANA_LENGTH", member, length), { files: [{ attachment, name: "banana.jpg" }]});
    }

    @constantly
    public async makeImage(length: number): Promise<Buffer> {
        const [ bananaImage, base ] = await Promise.all([this.getBananaImage(), this.getBase()]);
        const diff = length / 20;
        return new Canvas(500, 353)
            .printImage(base, 0, 0)
            .setColor("white")
            .printRectangle(0, 0, 500, 333)
            .printImage(bananaImage, 500 - (500 * diff), 333 - (333 * diff), 500 * diff, 333 * diff)
            .toBufferAsync();
    }

    private async getBase(): Promise<Image> {
        if (this.base) return this.base;
        const path = join(__dirname, "../../../assets/images/banana.png");
        return this.base = await resolveImage(path);
    }

    private async getBananaImage(): Promise<any> {
        if (this.bananaImage) return this.bananaImage;
        const base = await this.getBase();
        const { canvas }: any = new Canvas(500, 333).printImage(base, 0, 0);
        return this.bananaImage = canvas;
    }
}