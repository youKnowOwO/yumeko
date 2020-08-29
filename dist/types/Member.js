"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const USER_PATTERN = /^(?:<@!?)?([0-9]+)>?$/;
class TypeMember {
    constructor() {
        this.name = "member";
    }
    exec(msg, content) {
        if (USER_PATTERN.test(content))
            content = content.replace(USER_PATTERN, "$1");
        const members = msg.guild.members.cache.filter(x => x.id === content ||
            x.displayName.toLowerCase().includes(content.toLowerCase()) ||
            x.user.username.toLowerCase().includes(content.toLowerCase()) ||
            x.user.tag.toLowerCase().includes(content.toLowerCase()));
        if (!members.size)
            throw new CustomError_1.default("!PARSING", "Cannot found member. Please insert right type!");
        const selected = members.find(x => x.displayName === content && x.user.username === content);
        if (!selected && members.size > 1)
            throw new CustomError_1.default("!PARSING", `Please more specify spelling member name. like: ${members.map(x => `\`${x.displayName}\``).join(", ")}`);
        return selected || members.first();
    }
}
exports.default = TypeMember;
