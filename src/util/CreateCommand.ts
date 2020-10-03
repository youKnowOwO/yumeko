import { createInterface, ReadLineOptions } from "readline";
import { existsSync, promises } from "fs";
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

function end(prop?: string): void {
    if (prop) rl.write(chalk`{bgRed {black \ ERROR }} Command {blue ${prop}} is required`);
    rl.write("\n");
    process.exit(0);
}

export async function exec(): Promise<void> {
    rl.write(chalk`\n{bgBlue {black \ INFO }} Please describe your {blue command} !\n\n`);
    let aliases: string[] = [];
    const id = await awaitQuestion(chalk`  {blue •} What {blue identifier} for this command ? `);
    if (!id.length) return end("identifier");
    aliases.push(id);
    await awaitQuestion(chalk`  {blue •} Please insert {blue aliases} you want splited by comma (,) ! `).then(x => aliases.push(...x.split(",")));
    aliases = aliases.filter(x => x.length);
    const descriptionContent = await awaitQuestion(chalk`  {blue •} What {blue description} of the command ? {gray (if came from localization please insert the id between <>)} `)
        .then(x => {
            if (!x.length) return "";
            if (x.startsWith("<") && x.endsWith(">"))
                return `(msg): string => msg.ctx.lang("${x.replace(/<|>/g, "")}")`;
            return `"${x}"`;
        });
    if (!descriptionContent.length) return end("description");
    const usageDescription = await awaitQuestion(chalk`  {blue •} How you {blue usage} this command ? `);
    if (!usageDescription.length) return end("usage");
    const exampleDescription = await awaitQuestion(chalk`  {blue •} Please write at least 1 {blue example} ! `);
    if (!exampleDescription.length) return end("example");
    const category = await awaitQuestion(chalk`  {blue •} Which {blue category} that ship this command ? {gray (${categories.join(", ")})} `);
    if (!category.length) return end("categroy");
    const filename = await awaitQuestion(chalk`  {blue •} What the {blue filename} do you want ? {gray (${firstUpperCase(id)})} `).then(x => x.length ? x : firstUpperCase(id));
    const dirname = await awaitQuestion(chalk`  {blue •} What the {blue dirname} do you want ? {gray (${firstUpperCase(category)})} `).then(x => x.length ? x : firstUpperCase(category));
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
    const path = join("./src/commands", dirname);
    rl.write(chalk`\n{bgBlue {black \ INFO }} Checking directory...\n`);
    if (!existsSync(path)) {
        rl.write(chalk`{bgBlue {black \ INFO }} Directory isn't exist try to create...\n`);
        await promises.mkdir(path, { recursive: true });
        rl.write(chalk`{bgGreen {black \ DONE }} Directory Created !\n`);
    }
    rl.write(chalk`{bgBlue {black \ INFO }} Writting command...\n`);
    const file = join(path, `${filename}.ts`);
    await promises.writeFile(file, toWrite, { encoding: "utf-8" });
    rl.write(chalk`{bgGreen {black \ DONE }} Succes write command to {green ${file}}\n`);
    return end();
}

exec();