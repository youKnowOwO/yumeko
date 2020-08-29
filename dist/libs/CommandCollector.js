"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandRunner_1 = __importDefault(require("@yumeko/libs/CommandRunner"));
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const ReaddirRecursive_1 = __importDefault(require("@yumeko/util/ReaddirRecursive"));
const discord_js_1 = require("discord.js");
const path_1 = require("path");
const categoryNames = require("../../assets/json/help.json");
class CommandCollector {
    constructor(client) {
        this.client = client;
        this.commands = new discord_js_1.Collection();
        this.categories = [];
        this.runner = new CommandRunner_1.default(this.client);
    }
    loadAll(log = true) {
        const path = path_1.join(__dirname, "../commands");
        const files = ReaddirRecursive_1.default(path);
        const { print, color, equal, date } = this.client.log;
        if (log)
            print(equal(color("▶️ Collecting Command", "00C2FF")));
        for (const file of files) {
            const load = require(file).default;
            if (!load || !(load.prototype instanceof Command_1.default))
                continue;
            const command = this.getCommand(file);
            this.registry(command);
            if (log)
                print(`+ ${color(command.identifier, "FE9DFF")} (${color(file, "A20092")})`);
        }
        if (log)
            print(equal(color(date(), "505050")));
    }
    registry(command) {
        if (typeof command === "string")
            command = this.getCommand(command);
        this.addToCategory(command);
        this.commands.set(command.identifier, command);
    }
    getCommand(path) {
        const command = new (require(path).default)(this.client);
        command.dir = path;
        command.collector = this;
        return command;
    }
    addToCategory(command) {
        const category = this.categories.find(x => x.type === command.option.category) || {
            type: command.option.category,
            name: categoryNames[command.option.category] || "❌ | Uncategorized",
            commands: []
        };
        if (!category.commands.some(x => x.identifier === command.identifier))
            category.commands.push(command);
        if (!this.categories.some(x => x.type === command.option.category))
            this.categories.push(category);
    }
}
exports.default = CommandCollector;
