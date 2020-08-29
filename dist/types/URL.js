"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
class TypeURL {
    constructor() {
        this.name = "url";
    }
    exec(_, content) {
        try {
            return new URL(content);
        }
        catch {
            throw new CustomError_1.default("!PARSING", "Invalid URL");
        }
    }
}
exports.default = TypeURL;
