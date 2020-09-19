"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const Stopwatch_1 = __importDefault(require("@yumeko/util/Stopwatch"));
const decorators_1 = require("@yumeko/decorators");
const util_1 = require("util");
const Util_1 = require("@yumeko/util/Util");
const { getPromiseDetails } = process.binding("util");
const { Canvas, resolveImage } = require("canvas-constructor");
let default_1 = class default_1 extends Command_1.default {
    async exec(msg, { isAsync, isHide, showStack, isCanvas, depth, code }) {
        const { succes, result, time, type } = await this.eval(msg, code, depth, isAsync, isCanvas, showStack);
        if (isHide)
            return msg;
        const emoji = msg.guild.me.hasPermission("USE_EXTERNAL_EMOJIS") ?
            (succes ? "<:right:734220684825329775>" : "<:wrong:734220683445403749>") :
            (succes ? "❌" : "✅");
        if (isCanvas && result instanceof Buffer)
            return msg.ctx.send(`${emoji} **| ⏱ ${time}**`, { files: [{ attachment: result, name: "result.png" }] });
        let toSend = `${emoji} **| ⏱ ${time}**\n${Util_1.codeBlock("js", result)}\n${Util_1.codeBlock("ts", type)}`;
        if (toSend.length >= 2000)
            toSend = `${emoji} **| ⏱ ${time}\n${await Util_1.hastebin(`${result}\n\n${type}`, "js")}**`;
        return msg.ctx.send(toSend);
    }
    async eval(msg, code, depth, isAsync, isCanvas, showStack) {
        const stopwatch = new Stopwatch_1.default();
        let isPromise = false;
        let succes = false;
        let promiseConstructor = "Promise";
        let syncTime;
        let asyncTime;
        let type;
        let result;
        try {
            if (isCanvas) {
                if (!code.startsWith("new Canvas"))
                    throw new TypeError("Initialize new Canvas using 'new Canvas(width, height)'");
                isAsync = true;
                code = `return ${code}`;
            }
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
        }
        catch (e) {
            if (!syncTime)
                syncTime = stopwatch.toString();
            if (isPromise && !asyncTime)
                asyncTime = stopwatch.toString();
            if (!type)
                type = isPromise ? `${promiseConstructor}<${this.parseType(e)}>` : this.parseType(e);
            result = showStack ? e.stack : String(e);
        }
        if (result instanceof Canvas && isCanvas)
            result = await result.toBufferAsync();
        result = typeof result === "string" || (isCanvas && result instanceof Buffer && msg.guild.me.hasPermission("ATTACH_FILES")) ? result : util_1.inspect(result, { depth });
        if (typeof result === "string")
            result = this.replaceSensitive(result);
        const time = asyncTime ? `${syncTime}<${asyncTime}>` : syncTime;
        return { succes, result, time, type };
    }
    parseType(value) {
        const type = typeof value;
        if (value instanceof Array || value instanceof Set) {
            const types = new Set();
            for (const val of value)
                types.add(this.parseType(val));
            return `${value.constructor.name}<${[...types].join(" | ")}>`;
        }
        else if (value instanceof Buffer) {
            return `${value.constructor.name} (${Util_1.formatBytes(value.length)})`;
        }
        else if (value instanceof Map) {
            const keys = new Set();
            const values = new Set();
            for (const k of value.keys())
                keys.add(this.parseType(k));
            for (const v of value.values())
                values.add(this.parseType(v));
            return `${value.constructor.name}<${[...keys].join(" | ")}, ${[...values].join(" | ")}>`;
        }
        else if (value instanceof Promise) {
            const [status, val] = getPromiseDetails(value);
            return `${value.constructor.name} <${status ? this.parseType(val) : "unknown"}>`;
        }
        else if (type === "function") {
            return `${value.constructor.name} (${value.length}-arity)`;
        }
        else if (value === null) {
            return "null";
        }
        else if (value.constructor) {
            return value.constructor.name;
        }
        else if (type === "undefined") {
            return "void";
        }
        else if (type === "object") {
            return "any";
        }
        return type;
    }
    replaceSensitive(str) {
        const regex = new RegExp(Util_1.escapeRegex(this.client.token), "g");
        return str.replace(regex, "[TOKEN :)]");
    }
};
__decorate([
    decorators_1.constantly
], default_1.prototype, "exec", null);
__decorate([
    decorators_1.constantly
], default_1.prototype, "eval", null);
__decorate([
    decorators_1.hide
], default_1.prototype, "parseType", null);
__decorate([
    decorators_1.hide
], default_1.prototype, "replaceSensitive", null);
default_1 = __decorate([
    decorators_1.DeclareCommand("eval", {
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
], default_1);
exports.default = default_1;
