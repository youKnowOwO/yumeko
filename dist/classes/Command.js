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
class Command {
    constructor(client, identifier, option) {
        this.client = client;
        this.identifier = identifier;
        this.option = option;
        this.dir = __dirname;
    }
    exec(msg, args) {
        throw new CustomError_1.default("CommandError", "Exec Function must be declared");
    }
    ignore(msg) {
        return false;
    }
    disable(disable) {
        if (typeof disable !== "boolean")
            this.option.disable = !this.option.disable;
        else
            this.option.disable = disable;
        return this.option.disable;
    }
}
__decorate([
    decorators_1.constantly
], Command.prototype, "exec", null);
__decorate([
    decorators_1.constantly
], Command.prototype, "ignore", null);
__decorate([
    decorators_1.constantly
], Command.prototype, "disable", null);
exports.default = Command;
