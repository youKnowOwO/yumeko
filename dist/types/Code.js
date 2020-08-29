"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const CODEBLOCK_PATTERN = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i;
class TypeImage {
    constructor() {
        this.name = "code";
    }
    exec(msg, content) {
        const parsed = CODEBLOCK_PATTERN.exec(content);
        if (!parsed)
            throw new CustomError_1.default("!PARSING", "**Please contain a codeblock. like:** ```this```");
        return {
            code: parsed[2],
            lang: parsed[1] ? parsed[1].toLowerCase() : undefined
        };
    }
}
exports.default = TypeImage;
