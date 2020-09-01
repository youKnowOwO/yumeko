"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.langCollector = exports.Localization = void 0;
const ReaddirRecursive_1 = __importDefault(require("@yumeko/util/ReaddirRecursive"));
const discord_js_1 = require("discord.js");
const path_1 = require("path");
class Localization {
    constructor(guild) {
        this.guild = guild;
        this.client = this.guild.client;
        this.lang = "en_US";
    }
    get(key, ...args) {
        const result = this.client.langs.get(this.lang);
        if (!result)
            return `${this.lang}: ${key}`;
        return result[key](...args);
    }
}
exports.Localization = Localization;
function langCollector() {
    const result = new discord_js_1.Collection();
    const path = path_1.join(__dirname, "../langs");
    const files = ReaddirRecursive_1.default(path);
    for (const file of files) {
        const lang = require(file).default;
        result.set(lang.META_ID(), lang);
    }
    return result;
}
exports.langCollector = langCollector;
