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
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const decorators_1 = require("@yumeko/decorators");
class TypeNumber {
    constructor() {
        this.name = "number";
    }
    exec(msg, content) {
        const result = Number(content);
        if (isNaN(result))
            throw new CustomError_1.default("!PARSING", msg.guild.loc.get("TYPE_NUMBER_NOT_FOUND", content));
        return result;
    }
}
__decorate([
    decorators_1.constantly
], TypeNumber.prototype, "exec", null);
exports.default = TypeNumber;
