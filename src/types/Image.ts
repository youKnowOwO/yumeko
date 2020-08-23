import YumekoClient from "@yumeko/classes/Client";
import CustomError from "@yumeko/classes/CustomError";
import type { Message, User } from "discord.js";
import { Type } from "@yumeko/interfaces";
import { extname } from "path";

const IMAGE_PATTERN =/^\.(jpe?g|png|gif|bmp|gif)$/;

export default class TypeImage implements Type {
    readonly name = "image";
    public exec(msg: Message, content: string): string {
        const attachment = msg.attachments.first();
        if (attachment) {
            if (attachment.size > 0x7A1200) throw new CustomError("!PARSING", "**Maximum file size is `8MB`**");
            content = attachment.url;
        }
        let url: URL;
        try {
            url = new URL(content);
        } catch {
            const userType = (msg.client as YumekoClient).collector.runner.argsParser.getType("user");
            const user: User = userType(msg, content) as any;
            content = user.displayAvatarURL({ format: "png", size: 512, dynamic: true });
            url = new URL(content);
        }
        const ext = extname(url.pathname);
        if (!IMAGE_PATTERN.test(ext)) throw new CustomError("!PARSING", "**Unsupported file type. supported: `PNG`, `JPG`, `BMP`, `GIF`**`");
        return content;
    }
}