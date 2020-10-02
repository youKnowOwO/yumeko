"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
class TypeMemberhuman {
    constructor() {
        this.name = "member:human";
    }
    exec(msg, content) {
        const memberType = msg.client.collector.runner.argsParser.getType("member");
        const member = memberType(msg, content);
        if (member.user.bot)
            throw new CustomError_1.default("!PARSING", msg.ctx.lang("TYPE_HUMAN_BOT"));
        if (member.user.id === msg.author.id)
            throw new CustomError_1.default("!PARSING", msg.ctx.lang("TYPE_HUMAN_SELF"));
        return member;
    }
}
exports.default = TypeMemberhuman;
