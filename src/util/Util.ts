import request from "node-superfetch";

export async function hastebin(text: string, lang = "js"): Promise<string> {
    const { body } = await request.post("https://hasteb.in/documents")
        .send(text);
    return `https://hasteb.in/${(body as any).key}.${lang}`;
}

export function codeBlock(lang: string, str = ""): string{
    if(!str.trim().length) return "``` ```";
    return `\`\`\`${lang}\n${str}\`\`\``;
}

export function firstUpperCase(text: string): string {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export function chunk<T>(arr: T[], len: number): T[][] {
    const rest: T[][] = [];
    for(let i = 0; i < arr.length; i += len)
        rest.push(arr.slice(i, i+len));
    return rest;
}