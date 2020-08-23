import Command from "@yumeko/classes/Command";
import Stopwatch from "@yumeko/util/Stopwarch";
import child_process from "child_process";
import type { Message } from "discord.js";
import { DeclareCommand } from "@yumeko/decorators";
import { hastebin, codeBlock } from "@yumeko/util/Util";
import { promisify } from "util";

const exec = promisify(child_process.exec);

@DeclareCommand("exec", {
    aliases: ["exec"],
    description: {
        content: "exec some sheell script",
        usage: "exec <code>",
        examples: ["exec 1+1"]
    },
    category: "owner",
    devOnly: true,
    args: [
        {
            identifier: "code",
            type: "string",
            match: "rest",
            prompt: "What code do you want me to execuate ?"
        }
    ]
})
export default class ExecCommand extends Command {
    public async exec(msg: Message, { code }: { code: string }): Promise<Message> {
        const { stdout, stderr, time } = await this.execute(code);
        const canUseExternal = msg.guild!.me!.hasPermission("USE_EXTERNAL_EMOJIS");
        const outMoji = canUseExternal ? "<:right:734220684825329775>" : "✅";
        const errMoji = canUseExternal ? "<:wrong:734220683445403749>" : "❌";
        let toSend = "";
        if (stdout.length) toSend += `${outMoji} **| STDOUT**\n${codeBlock("sh", stdout)}`;
        if (stderr.length) toSend += `${errMoji} **| STDERR**\n${codeBlock("sh", stderr)}`;
        toSend += `⏱️ ${time}`;
        if (toSend.length >= 2000) {
            toSend = "";
            if (stdout.length) toSend += `${outMoji} **| STDOUT: ${await hastebin(stdout, "sh")}**`;
            if (stderr.length) toSend += `${errMoji} **| STDEER: ${await hastebin(stderr, "sh")}**`;
            toSend += `⏱️ ${time}`;
        }
        return msg.ctx.send(toSend);
    }

    public async execute(code: string): Promise<{ stdout: string; stderr: string; time: string }> {
        const stopwatch = new Stopwatch();
        const result = await exec(code).catch(e => e);
        return {...result, time: stopwatch.toString() };
    }
}