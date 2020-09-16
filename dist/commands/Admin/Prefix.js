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
let default_1 = class default_1 extends Command_1.default {
    async exec(msg, { prefix }) {
        if (prefix) {
            msg.guild.prefix = prefix;
            if (msg.prefix)
                await msg.guild.updateDatabase();
            return msg.ctx.send(msg.guild.loc.get("COMMAND_PREFIX_SET_TO", prefix));
        }
        return msg.ctx.send(msg.guild.loc.get("COMMAND_PREFIX_CURRENT", msg.guild.prefix));
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("prefix", {
        aliases: ["prefix", "setprefix"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_PREFIX_DESCRIPTION"),
            usage: "prefix [pref]",
            examples: ["prefix", "prefix !"]
        },
        category: "admin",
        permissions: {
            user: ["MANAGE_GUILD"]
        },
        args: [
            {
                identifier: "prefix",
                match: "rest",
                type: "string"
            }
        ]
    })
], default_1);
exports.default = default_1;
