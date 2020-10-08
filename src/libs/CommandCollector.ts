import type YumekoClient from "@yumeko/classes/Client";
import CommandRunner from "@yumeko/libs/CommandRunner";
import Command from "@yumeko/classes/Command";
import readdirRecursive from "@yumeko/util/ReaddirRecursive";
import { CommandCollectorCategories } from "@yumeko/interfaces";
import { Collection } from "discord.js";
import { join } from "path";
import { hide } from "@yumeko/decorators";

const categoryNames = require("../../assets/json/help.json");

export default class CommandCollector {
    public commands: Collection<string, Command> = new Collection();
    public categories: CommandCollectorCategories[] = [];

    @hide
    public runner: CommandRunner = new CommandRunner(this.client);

    public constructor(public client: YumekoClient) {}

    public loadAll(): void {
        const path = join(__dirname, "../commands");
        const files = readdirRecursive(path);
        for (const file of files) {
            const load = require(file).default;
            if (!load || !(load.prototype instanceof Command)) continue;
            const command = this.getCommand(file);
            this.registry(command);
        }
        this.client.emit("commandStored");
    }

    public registry(command: string | Command): void {
        if (typeof command === "string") command = this.getCommand(command);
        this.addToCategory(command);
        this.commands.set(command.identifier, command);
        this.client.emit("commandStored", command);
    }

    public getCommand(path: string): Command {
        const command: Command = new (require(path).default)(this.client);
        command.dir = path;
        command.collector = this;
        return command;
    }

    public addToCategory(command: Command): void {
        const category: CommandCollectorCategories = this.categories.find(x => x.type === command.option.category) || {
            type: command.option.category,
            name: categoryNames[command.option.category] || "❌ | Uncategorized",
            commands: []
        };
        if (!category.commands.some(x => x.identifier === command.identifier)) category.commands.push(command);
        if (!this.categories.some(x => x.type === command.option.category)) this.categories.push(category);
    }
}