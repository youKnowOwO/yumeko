import Command from "../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand } from "../../decorators";
import { Canvas, resolveImage } from "canvas-constructor";
import { join } from "path";

@DeclareCommand("fortune-cookie", {
    aliases: ["fortune-cookie", "fortune"],
    description: {
        content: "crack your cookie and get the fortune.",
        usage: "fortune-cookie",
        examples: ["fortune-cookie"]
    },
    permissions: {
        client: ["ATTACH_FILES"]
    },
    category: "fun"
})
export default class FortuneCookieCommand extends Command {
    public fortunes: string[] = []; // cache the fortune message

    public async getFortune(): Promise<string> {
        if (!this.fortunes.length) this.fortunes = await request.get("https://raw.githubusercontent.com/dragonfire535/xiao/master/assets/json/fortune.json").then(x => JSON.parse(x.text) as string[]);
        return this.fortunes[Math.floor(Math.random() * this.fortunes.length)];
    }

    public async createImage(fortune: string): Promise<Buffer> {
        const path = join(__dirname, "../../../assets/images/fortune-cookie.png");
        const base = await resolveImage(path);
        return new Canvas(700, 500)
            .printImage(base, 0, 0)
            .translate(380, 335)
            .rotate(-13 * Math.PI/180)
            .setTextFont("15px sans-serif")
            .printWrappedText(fortune, 0, 0, 300)
            .toBufferAsync();
    }

    public async exec(msg: Message): Promise<Message> {
        const m = await msg.channel.send("🖌️ **| Painting...**");
        const fortune = await this.getFortune();
        const attachment = await this.createImage(fortune);
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "fortune-cookie.jpg" }]});
    }
}