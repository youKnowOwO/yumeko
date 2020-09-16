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
let CatCommand = class CatCommand extends Command_1.default {
    exec(msg) {
        return msg.ctx.send({ files: [{ attachment: "https://cataas.com/cat", name: "cat.jpg" }] });
    }
};
__decorate([
    decorators_1.constantly
], CatCommand.prototype, "exec", null);
CatCommand = __decorate([
    decorators_1.DeclareCommand("cat", {
        aliases: ["cat", "kitty"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_ANIMAL_DESCRIPTION", 2),
            usage: "cat",
            examples: ["cat"]
        },
        permissions: {
            client: ["ATTACH_FILES"]
        },
        category: "animals",
    })
], CatCommand);
exports.default = CatCommand;
