"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArgumentParser_1 = __importDefault(require("@yumeko/libs/ArgumentParser"));
const discord_js_1 = require("discord.js");
const Util_1 = require("@yumeko/util/Util");
class CommandRunner {
    constructor(client) {
        this.client = client;
        this.commandUsed = new discord_js_1.Collection();
        this.argsParser = new ArgumentParser_1.default(this.client);
    }
    async runCommand(msg, command) {
        try {
            const args = command.option.args ? await this.argsParser.parse(msg, command.option.args) : {};
            await command.exec(msg, args);
            return true;
        }
        catch (e) {
            if (!["CANCELED", "!UNDERSTAND"].includes(e.name)) {
                this.client.log.error(e);
                msg.channel.send(msg.ctx.lang("COMMAND_RUNNER_ERROR", Util_1.codeBlock("js", String(e))));
            }
            return false;
        }
    }
    async handle(msg) {
        if (msg.author.bot || !msg.guild ||
            !msg.guild.available ||
            !msg.guild.me.hasPermission(["SEND_MESSAGES"]))
            return undefined;
        const prefix = this.getPrefix(msg);
        if (!prefix)
            return undefined;
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandID = args.shift();
        const filter = (x) => x.option.aliases.includes(commandID);
        const command = this.client.collector.commands.filter(filter).first();
        if (!command)
            return undefined;
        if (this.isCooldown(msg))
            return undefined;
        if (command.option.devOnly && !msg.author.isDev)
            return undefined;
        if (command.option.nsfw && !msg.channel.nsfw)
            return msg.ctx.send(msg.ctx.lang("COMMAND_RUNNER_ONLY_NSFW"));
        if (!await this.allowed(msg, command.option.permissions, command.ignore))
            return undefined;
        msg.prefix = prefix === this.client.user.toString() ? `${this.client.user.tag} ` : prefix;
        msg.args = command.option.splitBy ? args.join(" ").split(command.option.splitBy) : args;
        msg.cmd = commandID;
        const payload = {
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
    isCooldown(msg, warn = true) {
        const now = Date.now();
        const used = this.commandUsed.get(msg.author.id) || {
            running: false,
            since: 0,
            amount: 0
        };
        if (used.running) {
            if (warn)
                msg.ctx.send(msg.ctx.lang("COMMAND_RUNNER_ONLY_ONE", msg.author));
            return true;
        }
        const cooldown = used.since + used.amount;
        if (now < cooldown) {
            const amount = (cooldown - now) / 1000;
            if (warn)
                msg.ctx.send(msg.ctx.lang("COMMAND_RUNNER_IN_COOLDOWN", msg.author, amount));
            return true;
        }
        return false;
    }
    async allowed(msg, permission, ignore) {
        if (!permission)
            return true;
        if (permission.client) {
            const permissions = this.checkMissPermission(msg.guild.me, permission.client);
            if (permissions.length) {
                const mappedPerms = permissions.map(x => `\`${x}\``).join().replace(/\_/g, " ");
                msg.ctx.send(msg.ctx.lang("COMMAND_RUNNER_MISSPERMS", msg.client.user, mappedPerms, true));
                return false;
            }
        }
        if (permission.user) {
            const permissions = this.checkMissPermission(msg.member, permission.user);
            if (permissions.length) {
                if (await ignore(msg))
                    return true;
                const mappedPerms = permissions.map(x => `\`${x}\``).join().replace(/\_/g, " ");
                msg.ctx.send(msg.ctx.lang("COMMAND_RUNNER_MISSPERMS", msg.author, mappedPerms, false));
                return false;
            }
        }
        return true;
    }
    checkMissPermission(member, perms) {
        const result = [];
        for (const perm of perms) {
            if (!member.permissions.has(perm))
                result.push(perm);
        }
        return result;
    }
    getPrefix(msg) {
        const prefixes = [msg.guild.prefix, this.client.user.toString()];
        for (const prefix of prefixes) {
            if (msg.content.startsWith(prefix))
                return prefix;
        }
    }
}
exports.default = CommandRunner;
