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
const Bunny_1 = __importDefault(require("@yumeko/commands/Animals/Bunny"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const decorators_1 = require("@yumeko/decorators");
class BirbCommand extends Bunny_1.default {
    constructor(client) {
        super(client, "birb");
    }
    async getImage() {
        const { body } = await node_superfetch_1.default.get("https://api.alexflipnote.dev/birb");
        return body.file;
    }
}
__decorate([
    decorators_1.constantly
], BirbCommand.prototype, "getImage", null);
exports.default = BirbCommand;
