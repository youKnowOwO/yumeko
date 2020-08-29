"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.exec = void 0;
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const path_1 = require("path");
async function exec(client, code, language) {
    const endpoint = path_1.join(client.config.myriad, "eval");
    const response = await node_superfetch_1.default.post(endpoint)
        .send({ code, language }).catch(e => e);
    if (response.ok)
        return [true, response.body.result];
    return [false, `${response.status}: ${response.text}`];
}
exports.exec = exec;
async function handle(msg) {
    const { collector } = msg.client;
    const command = collector.commands.get("code");
    if (msg.author.bot || !msg.guild ||
        !msg.guild.available ||
        command.session.has(msg.author.id) ||
        collector.runner.isCooldown(msg, false) ||
        !msg.guild.me.hasPermission(["ADD_REACTIONS", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"]))
        return false;
    if (collector.runner.getPrefix(msg))
        return false;
    let script;
    try {
        const typeCode = collector.runner.argsParser.getType("code");
        script = typeCode(msg, msg.content);
    }
    catch {
        return false;
    }
    if (!script.lang)
        return false;
    await msg.react("734220685345423382");
    const filter = (m, usr) => m.emoji.id === "734220685345423382" && usr.id === msg.author.id && !collector.runner.isCooldown(msg, false);
    const responses = await msg.awaitReactions(filter, { max: 1, time: 30000 });
    if (!responses.size)
        return false;
    command.exec(msg, { script });
    return true;
}
exports.handle = handle;
