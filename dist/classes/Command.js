"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
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
exports.default = Command;
