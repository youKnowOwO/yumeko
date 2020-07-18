import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import type { Message } from "discord.js";
import { inspect } from "util";
import { performance } from "perf_hooks";
import { hastebin, codeBlock } from "../../util/Util";

export default class EvalCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "eval", {
            aliases: ["eval"],
            description: {
                content: "Eval Javascript Anotation",
                usage: "eval <code>",
                examples: ["eval 1+1"]
            },
            category: "owner",
            devOnly: true,
            args: [
                {
                    identifier: "isAsync",
                    match: "flag",
                    flag: "async"
                },
                {
                    identifier: "isHide",
                    match: "flag",
                    flag: "hide"
                },
                {
                    identifier: "depth",
                    match: "flag",
                    type: "number",
                    flag: "depth",
                    default: 0
                },
                {
                    identifier: "code",
                    type: "string",
                    match: "rest",
                    prompt: "What code do you want me to evaluate ?"
                }
            ]
        });
    }

    public async exec(msg: Message, { code, isAsync, isHide, depth }: { code: string; isAsync: boolean; isHide: boolean; depth: number }): Promise<Message|void> {
        let result: any;
        let syncTime = performance.now();
        let asyncTime = 0;
        try {
            // eslint-disable-next-line no-eval
            let evaled: unknown = eval(`${isAsync ? "(async()=>{" : ""}${code}${isAsync ? "})()": ""}`);
            if(isAsync) {
                asyncTime = performance.now();
                evaled = await evaled;
                asyncTime = performance.now() - asyncTime;
            }
            syncTime = performance.now() - syncTime;
            if(isHide) return undefined;
            result = evaled;
        } catch(e) {
            result = `${e.name}: ${e.message}`;
        }
        result = typeof result === "string" ? result : inspect(result, { depth });
        const time = this.getTime(syncTime, asyncTime);
        let toSend = `⏱️ ${time} ${codeBlock("js", result)}`;
        if(toSend.length >= 2000) toSend = `⏱️ ${time}\n${await hastebin(result)}`;
        return msg.ctx.send(toSend);
    }

    public getTime(syncTime: number, asyncTime: number): string {
        return asyncTime ? `${syncTime}<${asyncTime}>ms` : `${syncTime}ms`;
    }
}