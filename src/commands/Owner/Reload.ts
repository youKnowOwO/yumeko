import type YumekoClient from "../../classes/Client";
import type ExecCommand from "./Exec";
import Command from "../../classes/Command";
import type { Message } from "discord.js";
import { parse } from "path";

export default class ReloadCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "reload", {
            aliases: ["reload"],
            description: {
                content: "Reload some command",
                usage: "reload [command]",
                examples: ["reload help"]
            },
            category: "owner",
            ownerOnly: true,
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
        });
    }

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

    public reload(commands: Command[]): void {
        for (const command of commands) {
            delete require.cache[require.resolve(command.dir)];
            const newCommand = this.collector.getCommand(command.dir);
            this.collector.commands.set(newCommand.identifier, newCommand);
        }
    }
}
