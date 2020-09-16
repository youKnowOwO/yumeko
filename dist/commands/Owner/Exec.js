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
const Stopwatch_1 = __importDefault(require("@yumeko/util/Stopwatch"));
const child_process_1 = __importDefault(require("child_process"));
const decorators_1 = require("@yumeko/decorators");
const Util_1 = require("@yumeko/util/Util");
const util_1 = require("util");
const exec = util_1.promisify(child_process_1.default.exec);
let ExecCommand = class ExecCommand extends Command_1.default {
    async exec(msg, { code }) {
        const { stdout, stderr, time } = await this.execute(code);
        const canUseExternal = msg.guild.me.hasPermission("USE_EXTERNAL_EMOJIS");
        const outMoji = canUseExternal ? "<:right:734220684825329775>" : "✅";
        const errMoji = canUseExternal ? "<:wrong:734220683445403749>" : "❌";
        let toSend = "";
        if (stdout.length)
            toSend += `${outMoji} **| STDOUT**\n${Util_1.codeBlock("sh", stdout)}`;
        if (stderr.length)
            toSend += `${errMoji} **| STDERR**\n${Util_1.codeBlock("sh", stderr)}`;
        toSend += `⏱️ ${time}`;
        if (toSend.length >= 2000) {
            toSend = "";
            if (stdout.length)
                toSend += `${outMoji} **| STDOUT: ${await Util_1.hastebin(stdout, "sh")}**`;
            if (stderr.length)
                toSend += `${errMoji} **| STDEER: ${await Util_1.hastebin(stderr, "sh")}**`;
            toSend += `⏱️ ${time}`;
        }
        return msg.ctx.send(toSend);
    }
    async execute(code) {
        const stopwatch = new Stopwatch_1.default();
        const result = await exec(code).catch(e => e);
        return { ...result, time: stopwatch.toString() };
    }
};
__decorate([
    decorators_1.constantly
], ExecCommand.prototype, "exec", null);
ExecCommand = __decorate([
    decorators_1.DeclareCommand("exec", {
        aliases: ["exec"],
        description: {
            content: "exec some sheell script",
            usage: "exec <code>",
            examples: ["exec 1+1"]
        },
        category: "owner",
        devOnly: true,
        args: [
            {
                identifier: "code",
                type: "string",
                match: "rest",
                prompt: "What code do you want me to execuate ?"
            }
        ]
    })
], ExecCommand);
exports.default = ExecCommand;
