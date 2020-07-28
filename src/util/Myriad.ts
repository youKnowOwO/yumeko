import type YumekoClient from "../classes/Client";
import request from "node-superfetch";
import { Message, MessageReaction, User } from "discord.js";
import { TypeCodeReturn } from "../interfaces";
import { join } from "path";
import type CodeCommand from "../commands/Util/Code";

export async function exec(client: YumekoClient, code: string, language: string): Promise<[boolean, string]> {
    const endpoint = join(client.config.myriad, "eval");
    const response = await request.post(endpoint)
        .send({ code, language } as any).catch(e => e);
    if (response.ok) return [true, response.body.result];
    return [false, `${response.status}: ${response.text}`];
}

export async function handle(msg: Message): Promise<boolean> {
    const { collector } = (msg.client as YumekoClient);
    const command = collector.commands.get("code");
    if (msg.author.bot || !msg.guild ||
        !msg.guild.available ||
        (command as CodeCommand).session.has(msg.author.id) ||
        collector.runner.isCooldown(msg, false) ||
        !msg.guild.me!.hasPermission(["ADD_REACTIONS", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return false;
    if (collector.runner.getPrefix(msg)) return false;
    let script: TypeCodeReturn;
    try {
        const typeCode = collector.runner.argsParser.getType("code");
        script = typeCode(msg, msg.content) as any;
    } catch {
        return false;
    }
    if (!script.lang) return false;
    await msg.react("734220685345423382");
    const filter = (m: MessageReaction, usr: User): boolean => m.emoji.id === "734220685345423382" && usr.id === msg.author.id && !collector.runner.isCooldown(msg, false);
    const responses = await msg.awaitReactions(filter, { max: 1, time: 30000});
    if (!responses.size) return false;
    command!.exec(msg, { script });
    return true;
}