import request from "node-superfetch";
import type { MessageReaction, Message, User } from "discord.js";

export async function hastebin(text: string, lang = "js"): Promise<string> {
    const { body } = await request.post("https://hasteb.in/documents")
        .send(text);
    return `https://hasteb.in/${(body as any).key}.${lang}`;
}

export function codeBlock(lang: string, str = ""): string{
    if (!str.trim().length) return "``` ```";
    return `\`\`\`${lang}\n${str}\`\`\``;
}

export function firstUpperCase(text: string): string {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export function chunk<T>(arr: T[], len: number): T[][] {
    const rest: T[][] = [];
    for (let i = 0; i < arr.length; i += len)
        rest.push(arr.slice(i, i+len));
    return rest;
}

export function trimArray<T>(array: (T|string)[], length = 10): (T|string)[] {
    if (array.length <= length) return array;
    const len = array.length - length;
    const temp = array.slice(0, length);
    temp.push(`...${len} more.`);
    return temp;
}

export function decodeHTMLEntities(str: string): string {
    return str.replace(/&#(\d+);/g, (_, code) => {
        return String.fromCharCode(code);
    });
}

export function readableTime(duration: number): string {
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const seconds = Math.floor(duration / SECOND) % 60;
    if (duration < MINUTE) return `00:${seconds.toString().padStart(2, "0")}`;
    const minutes = Math.floor(duration / MINUTE) % 60;
    let output = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    if (duration >= HOUR) {
        const hours = Math.floor(duration / HOUR);
        output = `${hours.toString().padStart(2, "0")}:${output}`;
    }
    return output;
}

export function parseTime(time: string): number {
    const parsed: number[] = [];
    const regex = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-zμ]*)/ig;
    time.replace(regex, (match: string, i: string) => String(parsed.push(parseInt(i, 10))));
    let result = 0;
    let quadrive = 1000;
    for (const parse of parsed.reverse()){
        result += parse * quadrive;
        quadrive = quadrive * 60;
    }
    return result;
}

export function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice(0);
    for (let i = arr.length - 1; i >= 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    return a;
}

export async function verify (msg: Message, to: User): Promise<boolean> {
    await msg.react("🇾");
    await msg.react("🇳");
    const filter = (m: MessageReaction, usr: User): boolean => ["🇾", "🇳"].includes(m.emoji.name) && usr.id === to.id;
    const responses = await msg.awaitReactions(filter, { max: 1, time: 30000 });
    return !!responses.size && responses.first()!.emoji.id === "🇾";
}