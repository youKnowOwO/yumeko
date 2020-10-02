"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
class TypeUserhuman {
    constructor() {
        this.name = "user:human";
    }
    exec(msg, content) {
        const userType = msg.client.collector.runner.argsParser.getType("user");
        const user = userType(msg, content);
        if (user.bot)
            throw new CustomError_1.default("!PARSING", msg.ctx.lang("TYPE_HUMAN_BOT"));
        if (user.id === msg.author.id)
            throw new CustomError_1.default("!PARSING", msg.ctx.lang("TYPE_HUMAN_SELF"));
        return user;
    }
}
exports.default = TypeUserhuman;
