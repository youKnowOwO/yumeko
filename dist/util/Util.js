"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegex = exports.verify = exports.shuffle = exports.parseTime = exports.readableTime = exports.decodeHTMLEntities = exports.trimArray = exports.chunk = exports.firstUpperCase = exports.codeBlock = exports.hastebin = void 0;
const node_superfetch_1 = __importDefault(require("node-superfetch"));
async function hastebin(text, lang = "js") {
    const { body } = await node_superfetch_1.default.post("https://hasteb.in/documents")
        .send(text);
    return `https://hasteb.in/${body.key}.${lang}`;
}
exports.hastebin = hastebin;
function codeBlock(lang, str = "") {
    if (!str.trim().length)
        return "``` ```";
    return `\`\`\`${lang}\n${str}\`\`\``;
}
exports.codeBlock = codeBlock;
function firstUpperCase(text) {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}
exports.firstUpperCase = firstUpperCase;
function chunk(...args) {
    const [arr, len] = args;
    const rest = [];
    for (let i = 0; i < arr.length; i += len)
        rest.push(arr.slice(i, i + len));
    return rest;
}
exports.chunk = chunk;
function trimArray(array, length = 10) {
    if (array.length <= length)
        return array;
    const len = array.length - length;
    const temp = array.slice(0, length);
    temp.push(`...${len} more.`);
    return temp;
}
exports.trimArray = trimArray;
function decodeHTMLEntities(str) {
    return str.replace(/&#(\d+);/g, (_, code) => {
        return String.fromCharCode(code);
    });
}
exports.decodeHTMLEntities = decodeHTMLEntities;
function readableTime(duration) {
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const seconds = Math.floor(duration / SECOND) % 60;
    if (duration < MINUTE)
        return `00:${seconds.toString().padStart(2, "0")}`;
    const minutes = Math.floor(duration / MINUTE) % 60;
    let output = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    if (duration >= HOUR) {
        const hours = Math.floor(duration / HOUR);
        output = `${hours.toString().padStart(2, "0")}:${output}`;
    }
    return output;
}
exports.readableTime = readableTime;
function parseTime(time) {
    const parsed = [];
    const regex = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-zμ]*)/ig;
    time.replace(regex, (match, i) => String(parsed.push(parseInt(i, 10))));
    let result = 0;
    let quadrive = 1000;
    for (const parse of parsed.reverse()) {
        result += parse * quadrive;
        quadrive = quadrive * 60;
    }
    return result;
}
exports.parseTime = parseTime;
function shuffle(arr) {
    const a = arr.slice(0);
    for (let i = arr.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    return a;
}
exports.shuffle = shuffle;
async function verify(msg, to) {
    await msg.react("🇾");
    await msg.react("🇳");
    const filter = (m, usr) => ["🇾", "🇳"].includes(m.emoji.name) && usr.id === to.id;
    const responses = await msg.awaitReactions(filter, { max: 1, time: 30000 });
    return !!responses.size && responses.first().emoji.name === "🇾";
}
exports.verify = verify;
function escapeRegex(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
exports.escapeRegex = escapeRegex;
