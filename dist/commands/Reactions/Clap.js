"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Amazed_1 = __importDefault(require("@yumeko/commands/Reactions/Amazed"));
class Clap extends Amazed_1.default {
    constructor(client) {
        super(client, "clap");
    }
}
exports.default = Clap;
