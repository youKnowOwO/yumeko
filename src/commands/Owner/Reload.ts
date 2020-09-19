import type ExecCommand from "@yumeko/commands/Owner/Exec";
import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";
import { parse } from "path";

@DeclareCommand("reload", {
    aliases: ["reload"],
    description: {
        content: "Reload some command",
        usage: "reload [command]",
        examples: ["reload help"]
    },
    category: "owner",
    devOnly: true,
    args: [
        {
            identifier: "dontBuild",
            match: "flag",
            flag: "dbuild"
        },
        {
            identifier: "command",
            type: "command",
            match: "single",
            optional: true
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { command, dontBuild }: { command?: Command; dontBuild: boolean }): Promise<Message> {
        const { execute } = this.collector.commands.get("exec") as ExecCommand;
        const { ext, dir } = parse(this.dir);
        // check if code runned by tsc or ts-node
        if (dir.includes("/dist/") && ext === ".js" && !dontBuild) await execute("yarn build");
        if (command) {
            this.reload([command]);
            return msg.ctx.send(`✅ **| Succes reloading command \`${command.identifier}\`**`);
        }
        this.reload(this.collector.commands.array());
        return msg.ctx.send("✅ **| Succes reloading all commands**");
    }

    @constantly
    public reload(commands: Command[]): void {
        for (const command of commands) {
            delete require.cache[require.resolve(command.dir)];
            const newCommand = this.collector.getCommand(command.dir);
            this.collector.commands.set(newCommand.identifier, newCommand);
        }
    }
}
