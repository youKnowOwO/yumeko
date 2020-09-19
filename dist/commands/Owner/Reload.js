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
const decorators_1 = require("@yumeko/decorators");
const path_1 = require("path");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg, { command, dontBuild }) {
        const { execute } = this.collector.commands.get("exec");
        const { ext, dir } = path_1.parse(this.dir);
        if (dir.includes("/dist/") && ext === ".js" && !dontBuild)
            await execute("yarn build");
        if (command) {
            this.reload([command]);
            return msg.ctx.send(`✅ **| Succes reloading command \`${command.identifier}\`**`);
        }
        this.reload(this.collector.commands.array());
        return msg.ctx.send("✅ **| Succes reloading all commands**");
    }
    reload(commands) {
        for (const command of commands) {
            delete require.cache[require.resolve(command.dir)];
            const newCommand = this.collector.getCommand(command.dir);
            this.collector.commands.set(newCommand.identifier, newCommand);
        }
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
__decorate([
    decorators_1.constantly
], default_1.prototype, "reload", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("reload", {
        aliases: ["reload"],
        description: {
            content: "Reload some command",
            usage: "reload [command]",
            examples: ["reload help"]
        },
        category: "owner",
        devOnly: true,
        args: [
            {
                identifier: "dontBuild",
                match: "flag",
                flag: "dbuild"
            },
            {
                identifier: "command",
                type: "command",
                match: "single",
                optional: true
            }
        ]
    })
], default_1);
exports.default = default_1;
