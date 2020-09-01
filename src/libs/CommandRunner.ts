import type YumekoClient from "@yumeko/classes/Client";
import type Command from "@yumeko/classes/Command";
import ArgumentParser from "@yumeko/libs/ArgumentParser";
import { Message, Collection, Snowflake, PermissionString, GuildMember } from "discord.js";
import { CommandUsed, CommandOption } from "@yumeko/interfaces";
import { codeBlock } from "@yumeko/util/Util";
import { TextChannel } from "discord.js";

export default class CommandRunner {
    public commandUsed: Collection<Snowflake, CommandUsed> = new Collection();
    public argsParser: ArgumentParser = new ArgumentParser(this.client);
    public constructor(public client: YumekoClient) {}

    public async runCommand(msg: Message,command: Command): Promise<boolean> {
        try {
            const args = command.option.args ? await this.argsParser.parse(msg, command.option.args) : {};
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await command.exec(msg, args);
            return true;
        } catch(e) {
            if (!["CANCELED", "!UNDERSTAND"].includes(e.name)) {
                this.client.log.error(e);
                msg.channel.send(msg.guild!.loc.get("COMMAND_RUNNER_ERROR", codeBlock("js", String(e))));
            }
            return false;
        }
    }

    public async handle(msg: Message): Promise<Message|void> {
        if (msg.author.bot || !msg.guild ||
             !msg.guild.available ||
              !msg.guild.me!.hasPermission(["SEND_MESSAGES"])) return undefined;
        const prefix = this.getPrefix(msg);
        if (!prefix) return undefined;
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandID = args.shift();
        const filter = (x: Command): boolean => x.option.aliases.includes(commandID!);
        const command = this.client.collector.commands.filter(filter).first();
        if (!command) return undefined;
        if (this.isCooldown(msg)) return undefined;
        if (command.option.devOnly && !msg.author.isDev) return undefined;
        if (command.option.nsfw && !(msg.channel as TextChannel).nsfw) return msg.ctx.send(msg.guild.loc.get("COMMAND_RUNNER_ONLY_NSFW"));
        if (!await this.allowed(msg, command.option.permissions, command.ignore)) return undefined;
        msg.prefix = prefix === this.client.user!.toString() ? `${this.client.user!.tag} ` : prefix;
        msg.args = command.option.splitBy ? args.join(" ").split(command.option.splitBy) : args;
        const payload: CommandUsed = {
            running: true,
            since: Date.now(),
            amount: (command.option.cooldown || 5) * 1000
        };
        this.commandUsed.set(msg.author.id, payload);
        const result = await this.runCommand(msg, command);
        payload.running = false;
        payload.since = result ? Date.now() : 0;
        this.commandUsed.set(msg.author.id, payload);
    }

    public isCooldown(msg: Message, warn = true): boolean {
        const now = Date.now();
        const used = this.commandUsed.get(msg.author.id) || {
            running: false,
            since: 0,
            amount: 0
        };
        if (used.running) {
            if (warn) msg.ctx.send(msg.guild!.loc.get("COMMAND_RUNNER_ONLY_ONE", msg.author));
            return true;
        }
        const cooldown = used.since + used.amount;
        if (now < cooldown) {
            const amount = (cooldown - now) / 1000;
            if (warn) msg.ctx.send(msg.guild!.loc.get("COMMAND_RUNNER_IN_COOLDOWN", msg.author, amount));
            return true;
        }
        return false;
    }

    public async allowed(msg: Message, permission: CommandOption["permissions"], ignore: Command["ignore"]): Promise<boolean> {
        if (!permission) return true;
        if (permission.client) {
            const permissions = this.checkMissPermission(msg.guild!.me!, permission.client);
            if (permissions.length) {
                const mappedPerms = permissions.map(x => `\`${x}\``).join().replace(/\_/g, " ");
                msg.ctx.send(msg.guild!.loc.get("COMMAND_RUNNER_MISSPERMS", msg.client.user!, mappedPerms, true));
                return false;
            }
        }
        if (permission.user) {
            const permissions = this.checkMissPermission(msg.member!, permission.user);
            if (permissions.length) {
                if (await ignore(msg)) return true;
                const mappedPerms = permissions.map(x => `\`${x}\``).join().replace(/\_/g, " ");
                msg.ctx.send(msg.guild!.loc.get("COMMAND_RUNNER_MISSPERMS", msg.author, mappedPerms, false));
                return false;
            }
        }
        return true;
    }

    public checkMissPermission(member: GuildMember, perms: PermissionString[]): PermissionString[] {
        const result: PermissionString[] = [];
        for (const perm of perms) {
            if (!member.permissions.has(perm)) result.push(perm);
        }
        return result;
    }

    public getPrefix(msg: Message): string|void {
        const prefixes: string[] = [this.client.config.prefix, this.client.user!.toString()];
        for (const prefix of prefixes) {
            if (msg.content.startsWith(prefix)) return prefix;
        }
    }
}