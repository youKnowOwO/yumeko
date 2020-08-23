import type YumekoClient from "@yumeko/classes/Client";
import type CommandCollector from "@yumeko/libs/CommandCollector";
import CustomError from "@yumeko/classes/CustomError";
import { CommandOption } from "@yumeko/interfaces";
import { Message } from "discord.js";

export default class Command {
    public dir = __dirname;
    public collector?: CommandCollector;
    public constructor(public client: YumekoClient, public identifier: string, public option: CommandOption) {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public exec(msg?: Message, args?: unknown): void {
        throw new CustomError("CommandError", "Exec Function must be declared");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public ignore(msg: Message): Promise<boolean>|boolean {
        return false;
    }

    public disable(disable?: boolean): boolean {
        if (typeof disable !== "boolean") this.option.disable = !this.option.disable;
        else this.option.disable = disable;
        return this.option.disable;
    }
}