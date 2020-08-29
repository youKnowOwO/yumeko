"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const MusicHandler_1 = __importDefault(require("@yumeko/libs/MusicHandler"));
class YumekoGuild extends discord_js_1.Structures.get("Guild") {
    constructor() {
        super(...arguments);
        this.music = new MusicHandler_1.default(this);
    }
}
discord_js_1.Structures.extend("Guild", () => YumekoGuild);
