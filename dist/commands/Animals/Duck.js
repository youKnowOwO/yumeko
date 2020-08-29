"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bunny_1 = __importDefault(require("@yumeko/commands/Animals/Bunny"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class DuckCommand extends Bunny_1.default {
    constructor(client) {
        super(client, "duck");
    }
    async getImage() {
        const { body } = await node_superfetch_1.default.get("https://random-d.uk/api/v1/random?type=gif");
        return body.url;
    }
}
exports.default = DuckCommand;
