import { createInterface, ReadLineOptions } from "readline";
import { promises } from "fs";
import { join } from "path";
import { firstUpperCase } from "./Util";
import chalk from "chalk";

const categories = Object.keys(require("../../assets/json/help.json"));

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
} as ReadLineOptions);

function awaitQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

function end(reason?: string): void {
    if (reason) rl.write(chalk`{bgRed {black \ CANCELED }} ${reason}`);
    else rl.write(chalk`{bgGreen {black \ SUCCES }} Command created ✓`);
    rl.write("\n");
    process.exit(0);
}

export async function exec(): Promise<void> {
    rl.write(chalk`{bgBlue {black \ INFO }} Please describe your command !`);
    rl.write("\n");
    let aliases: string[] = [];
    const id = await awaitQuestion(chalk`  {blue •} What identifier for this command ? `);
    if (!id.length) return end("Command identifier is required");
    aliases.push(id);
    await awaitQuestion(chalk`  {blue •} Please insert aliases you want splited by comma (,) ! `).then(x => aliases.push(...x.split(",")));
    aliases = aliases.filter(x => x.length);
    const descriptionContent = await awaitQuestion(chalk`  {blue •} What description of the command ? (if came from localization please insert the id between <>) `)
        .then(x => {
            if (!x.length) return "";
            if (x.startsWith("<") && x.endsWith(">"))
                return `(msg): string => msg.ctx.lang("${x.replace(/<|>/g, "")}")`;
            return `"${x}"`;
        });
    if (!descriptionContent.length) return end("Command Description is required");
    const usageDescription = await awaitQuestion(chalk`  {blue •} How you usage this command ? `);
    if (!usageDescription.length) return end("Command usage is required");
    const exampleDescription = await awaitQuestion(chalk`  {blue •} Please write at least 1 example ! `);
    if (!exampleDescription.length) return end("Command example is required");
    const category = await awaitQuestion(chalk`  {blue •} Which category that ship this command ? (${categories.join(", ")}) `);
    if (!category.length) return end("Command category is required");
    const filename = await awaitQuestion(chalk`  {blue •} What the filename do you want ? (${firstUpperCase(id)}) `).then(x => x.length ? x : firstUpperCase(id));
    const dirname = await awaitQuestion(chalk`  {blue •} What the dirname do you want ? (${firstUpperCase(category)}) `).then(x => x.length ? x : firstUpperCase(category));
    const toWrite = `import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("${id}", {
    aliases: [${aliases.map(x => `"${x}"`).join(", ")}],
    description: {
        content: ${descriptionContent},
        usage: "${usageDescription}",
        examples: ["${exampleDescription}"]
    },
    category: "${category}"
})
export default class extends Command {
    @constantly
    public async exec(msg: Message): Promise<Message> {
        return msg;
    }
}`;
    await promises.writeFile(join("./src/commands", dirname, `${filename}.ts`), toWrite, { encoding: "utf-8" });
    return end();
}

exec();