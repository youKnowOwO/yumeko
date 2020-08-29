"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bunny_1 = __importDefault(require("@yumeko/commands/Animals/Bunny"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class PandaCommand extends Bunny_1.default {
    constructor(client) {
        super(client, "panda");
    }
    async getImage() {
        const { body } = await node_superfetch_1.default.get("https://some-random-api.ml/animal/panda");
        return body.image;
    }
}
exports.default = PandaCommand;
