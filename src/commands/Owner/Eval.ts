import Command from "@yumeko/classes/Command";
import Stopwatch from "@yumeko/util/Stopwatch";
import type { Message } from "discord.js";
import { DeclareCommand, constantly, hide } from "@yumeko/decorators";
import { inspect } from "util";
import { hastebin, codeBlock, escapeRegex, formatBytes } from "@yumeko/util/Util";

// @ts-expect-error 2339
const { getPromiseDetails } = process.binding("util");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Canvas, resolveImage } = require("canvas-constructor");

interface ReturnEval {
    time: string;
    result: string | Buffer;
    succes: boolean;
    type: string;
}

@DeclareCommand("eval", {
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
            identifier: "showStack",
            match: "flag",
            flag: "stack"
        },
        {
            identifier: "isCanvas",
            match: "flag",
            flag: "canvas"
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
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { isAsync, isHide, showStack, isCanvas, depth, code }: { isAsync: boolean; isHide: boolean; showStack: boolean; isCanvas: boolean; depth: number; code: string }): Promise<Message> {
        const { succes, result, time, type } = await this.eval(msg, code, depth, isAsync, isCanvas, showStack);
        if (isHide) return msg;
        const emoji = msg.guild!.me!.hasPermission("USE_EXTERNAL_EMOJIS") ?
            (succes ? "<:right:734220684825329775>" : "<:wrong:734220683445403749>") :
            (succes ? "❌" : "✅");
        if (isCanvas && result instanceof Buffer) return msg.ctx.send(`${emoji} **| ⏱ ${time}**`, { files: [ { attachment: result, name: "result.png"}]});
        let toSend = `${emoji} **| ⏱ ${time}**\n${codeBlock("js", result as string)}\n${codeBlock("ts", type)}`;
        if (toSend.length >= 2000) toSend = `${emoji} **| ⏱ ${time}\n${await hastebin(`${result}\n\n${type}`, "js")}**`;
        return msg.ctx.send(toSend);
    }

    @constantly
    public async eval(msg: Message, code: string,  depth: number, isAsync: boolean, isCanvas: boolean, showStack: boolean): Promise<ReturnEval> {
        const stopwatch = new Stopwatch();
        let isPromise = false;
        let succes = false;
        let promiseConstructor = "Promise";
        let syncTime: string|void;
        let asyncTime: string|void;
        let type: string|void;
        let result: any;
        try {
            if (isCanvas) {
                if (!code.startsWith("new Canvas")) throw new TypeError("Initialize new Canvas using 'new Canvas(width, height)'");
                isAsync = true;
                code = `return ${code}`;
            }
            // eslint-disable-next-line no-eval
            let evaled = eval(isAsync ? `(async () => { ${code} })()` : code);
            syncTime = stopwatch.toString();
            if (evaled instanceof Promise && typeof evaled.then === "function" && typeof evaled.catch === "function") {
                promiseConstructor = evaled.constructor.name;
                evaled = await evaled;
                isPromise = true;
                asyncTime = stopwatch.toString();
            }
            type = isPromise ? `${promiseConstructor}<${this.parseType(evaled)}>` : this.parseType(evaled);
            result = evaled;
            succes = true;
        } catch(e) {
            if (!syncTime) syncTime = stopwatch.toString();
            if (isPromise && !asyncTime) asyncTime = stopwatch.toString();
            if (!type) type = isPromise ? `${promiseConstructor}<${this.parseType(e)}>` : this.parseType(e);
            result = showStack ? e.stack : String(e);
        }
        if (result instanceof Canvas && isCanvas) result = await result.toBufferAsync();
        result = typeof result === "string" || (isCanvas && result instanceof Buffer && msg.guild!.me!.hasPermission("ATTACH_FILES")) ? result : inspect(result, { depth });
        if (typeof result === "string") result = this.replaceSensitive(result);
        const time = asyncTime ? `${syncTime}<${asyncTime}>` : syncTime;
        return { succes, result, time, type };
    }

    @hide
    private parseType(value: any): string {
        const type = typeof value;
        if (value instanceof Array || value instanceof Set) {
            const types = new Set<string>();
            for (const val of value) types.add(this.parseType(val));
            if (!types.size) return `${value.constructor.name}`;
            return `${value.constructor.name}<${[...types].join(" | ")}>`;
        } else if (value instanceof Buffer) {
            return `${value.constructor.name} (${formatBytes(value.length)})`;
        } else if (value instanceof Map) {
            if (!value.size) return `${value.constructor.name}`;
            const keys = new Set<string>();
            const values = new Set<string>();
            for (const k of value.keys()) keys.add(this.parseType(k));
            for (const v of value.values()) values.add(this.parseType(v));
            return `${value.constructor.name}<${[...keys].join(" | ")}, ${[...values].join(" | ")}>`;
        } else if (value instanceof Promise) {
            const [status, val]: [number, unknown] = getPromiseDetails(value);
            return `${value.constructor.name}<${status ? this.parseType(val) : "unknown"}>`;
        } else if (type === "function") {
            return `${value.constructor.name} (${value.length}-arity)`;
        } else if (value === null) {
            return "null";
        } else if (type === "undefined") {
            return "void";
        } else if (type === "object") {
            if (value.constructor) return value.constructor.name;
            return "any";
        }
        return type;
    }

    @hide
    private replaceSensitive(str: string): string {
        const regex = new RegExp(escapeRegex(this.client.token!), "g");
        return str.replace(regex, "[TOKEN :)]");
    }
}
