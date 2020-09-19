import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import type { Image } from "canvas";
import { DeclareCommand, hide, constantly } from "@yumeko/decorators";
import { Canvas, resolveImage } from "canvas-constructor";
import { join } from "path";

@DeclareCommand("fortune-cookie", {
    aliases: ["fortune-cookie", "fortune"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_FORTUNE_COOKIE_DESCRIPTION"),
        usage: "fortune-cookie",
        examples: ["fortune-cookie"]
    },
    permissions: {
        client: ["ATTACH_FILES"]
    },
    category: "fun"
})
export default class extends Command {
    @hide
    private fortunes: string[] = []; // cache the fortune message

    @hide
    private cookieImage?: Image;

    @constantly
    public async getFortune(): Promise<string> {
        if (!this.fortunes.length) this.fortunes = await request.get("https://raw.githubusercontent.com/dragonfire535/xiao/master/assets/json/fortune.json").then(x => JSON.parse(x.text) as string[]);
        return this.fortunes[Math.floor(Math.random() * this.fortunes.length)];
    }

    @constantly
    public async createImage(fortune: string): Promise<Buffer> {
        const base = await this.getCookieImage();
        return new Canvas(700, 500)
            .printImage(base, 0, 0)
            .translate(380, 335)
            .rotate(-13 * Math.PI/180)
            .setTextFont("15px sans-serif")
            .printWrappedText(fortune, 0, 0, 300)
            .toBufferAsync();
    }

    @constantly
    public async exec(msg: Message): Promise<Message> {
        const m = await msg.channel.send(msg.guild!.loc.get("COMMAND_FUN_PAINTING"));
        const fortune = await this.getFortune();
        const attachment = await this.createImage(fortune);
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "fortune-cookie.jpg" }]});
    }

    private async getCookieImage(): Promise<Image> {
        if (this.cookieImage) return this.cookieImage;
        const path = join(__dirname, "../../../assets/images/fortune-cookie.png");
        return this.cookieImage = await resolveImage(path);
    }
}