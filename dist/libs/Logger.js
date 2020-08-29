"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_tags_1 = require("common-tags");
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
const momentFormat = "MMMM Do YYYY, h:mm:ss a";
class Logger {
    write(head, value) {
        const date = this.date();
        const log = common_tags_1.stripIndents `
            ${this.equal(chalk_1.default.bold(head))}
            ${value}
            ${this.equal(chalk_1.default.grey(date))}
            \u200B
        `;
        process.stdout.write(log);
    }
    date() {
        return moment_1.default(Date.now()).format(momentFormat);
    }
    color(input, hex) {
        input = typeof input === "string" ? input : util_1.format(input);
        return chalk_1.default.hex(hex)(input);
    }
    equal(input, max = 50) {
        const result = input.length > max ? 0 : max - input.length;
        const eq = "=".repeat(result / 2);
        return `${eq} ${input} ${eq}`;
    }
    print(input) {
        process.stdout.write(`${util_1.format(input)}\n`);
    }
    info(value) {
        return this.write(this.color("^w^) INFO", "2ECC71"), this.color(value, "1F8B4C"));
    }
    error(value) {
        return this.write(this.color("'-') ERROR", "E74C3C"), this.color(value, "C27C0E"));
    }
    warn(value) {
        return this.write(this.color("°^°) WARN", "FFFF00"), this.color(value, "992D22"));
    }
}
exports.default = Logger;
