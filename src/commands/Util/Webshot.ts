import Command from "../../classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand } from "../../decorators";

@DeclareCommand("webshot", {
    aliases: ["webshot", "web-screenshot", "web-capture"],
    description: {
        content: "Screenshot some site",
        usage: "webshot <url>",
        examples: ["webshot https://google.com"]
    },
    permissions: {
        client: ["ATTACH_FILES"]
    },
    category: "utility",
    nsfw: true,
    args: [
        {
            identifier: "url",
            match: "rest",
            type: "url",
            prompt: "Which site do you want to capture ?"
        }
    ]
})
export default class WebshotCommand extends Command {
    public async exec(msg: Message, { url }: { url: URL }): Promise<Message> {
        const m = await msg.channel.send("📸 **| Capturing**");
        const { raw } = await request.get(`https://image.thum.io/get/width/1920/crop/675/noanimate/${url}`);
        m.delete();
        return msg.ctx.send({ files: [{ attachment: raw, name: "webshot.jpg"}]});
    }
}