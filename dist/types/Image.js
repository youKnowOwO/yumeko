"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const path_1 = require("path");
const IMAGE_PATTERN = /^\.(jpe?g|png|gif|bmp|gif)$/;
class TypeImage {
    constructor() {
        this.name = "image";
    }
    exec(msg, content) {
        const attachment = msg.attachments.first();
        if (attachment) {
            if (attachment.size > 0x7A1200)
                throw new CustomError_1.default("!PARSING", "**Maximum file size is `8MB`**");
            content = attachment.url;
        }
        let url;
        try {
            url = new URL(content);
        }
        catch {
            const userType = msg.client.collector.runner.argsParser.getType("user");
            const user = userType(msg, content);
            content = user.displayAvatarURL({ format: "png", size: 512, dynamic: true });
            url = new URL(content);
        }
        const ext = path_1.extname(url.pathname);
        if (!IMAGE_PATTERN.test(ext))
            throw new CustomError_1.default("!PARSING", "**Unsupported file type. supported: `PNG`, `JPG`, `BMP`, `GIF`**`");
        return content;
    }
}
exports.default = TypeImage;
