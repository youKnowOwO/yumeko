"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
class TypeNumber {
    constructor() {
        this.name = "number";
    }
    exec(msg, content) {
        const result = Number(content);
        if (isNaN(result))
            throw new CustomError_1.default("!PARSING", msg.guild.loc.get("TYPE_NUMBER_NOT_FOUND", content));
        return result;
    }
}
exports.default = TypeNumber;
