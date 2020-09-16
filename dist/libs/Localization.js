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
exports.langCollector = exports.Localization = void 0;
const ReaddirRecursive_1 = __importDefault(require("@yumeko/util/ReaddirRecursive"));
const discord_js_1 = require("discord.js");
const path_1 = require("path");
const decorators_1 = require("@yumeko/decorators");
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
__decorate([
    decorators_1.hide
], Localization.prototype, "client", void 0);
__decorate([
    decorators_1.constantly
], Localization.prototype, "get", null);
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
