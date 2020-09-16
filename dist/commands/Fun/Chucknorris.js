"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const decorators_1 = require("@yumeko/decorators");
let ChucknorrisCommand = class ChucknorrisCommand extends Command_1.default {
    async exec(msg) {
        const { body } = await node_superfetch_1.default.get("https://api.icndb.com/jokes/random");
        return msg.ctx.send(`📢 **| ${body.value.joke}**`);
    }
};
__decorate([
    decorators_1.constantly
], ChucknorrisCommand.prototype, "exec", null);
ChucknorrisCommand = __decorate([
    decorators_1.DeclareCommand("chucknorris", {
        aliases: ["chucknorris"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_CHUCKNORRIS_DESCRIPTION"),
            usage: "chucknorris",
            examples: ["chucknorris"]
        },
        category: "fun"
    })
], ChucknorrisCommand);
exports.default = ChucknorrisCommand;
