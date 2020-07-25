import type YumekoClient from "../classes/Client";
import request from "node-superfetch";
import { Message, MessageReaction, User } from "discord.js";
import { CommandUsed } from "../interfaces";

export async function exec(client: YumekoClient, code: string, language: string): Promise<[boolean, string]> {
    const response = await request.post(client.config.myriad)
        .send({ code, language } as any).catch(e => e);
    if (response.ok) return [true, response.text];
    return [false, `${response.status}: ${response.text}`];
}

export async function handle(msg: Message): Promise<boolean> {
    const { collector } = (msg.client as YumekoClient);
    if (msg.author.bot || !msg.guild ||
        !msg.guild.available ||
        collector.runner.isCooldown(msg) ||
        !msg.guild.me!.hasPermission(["ADD_REACTIONS", "SEND_MESSAGES", "EMBED_LINKS"])) return false;
    await msg.react("734220685345423382");
    const filter = (m: MessageReaction, usr: User): boolean => m.emoji.id === "734220685345423382" && usr.id === msg.author.id;
    const responses = await msg.awaitReactions(filter, { max: 1, time: 30000});
    if (!responses.size) return false;
    const command = collector.commands.get("code")!;
    const payload: CommandUsed = {
        running: true,
        since: Date.now(),
        amount: (command.option.cooldown || 5) * 1000
    };
    collector.runner.commandUsed.set(msg.author.id, payload);
    try {
        const typeCode = collector.runner.argsParser.getType("code");
        const script = typeCode(msg, msg.content);
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await command.exec(msg, script);
        payload.running = false;
        payload.since = Date.now();
    } catch(e) {
        payload.since = 0;
    }
    collector.runner.commandUsed.set(msg.author.id, payload);
    return true;
}