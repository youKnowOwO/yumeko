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