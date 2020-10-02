"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
class TypeCommand {
    constructor() {
        this.name = "command";
    }
    exec(msg, content) {
        let { commands } = msg.client.collector;
        if (!msg.author.isDev)
            commands = commands.filter(x => !x.option.devOnly);
        const command = commands.filter(x => x.option.aliases.includes(content.toLowerCase())).first();
        if (!command) {
            const similiar = commands.map(x => x.option.aliases).reduce((a, b) => a.concat(b))
                .filter(x => x.includes(content.toLowerCase()))
                .splice(0, 10)
                .map(x => x.replace(content.toLowerCase(), `**${content.toLowerCase()}**`))
                .join(", ");
            throw new CustomError_1.default("!PARSING", msg.ctx.lang("TYPE_COMMAND_HAS_SIMILIAR", content, similiar));
        }
        return command;
    }
}
exports.default = TypeCommand;
