import Command from "@yumeko/classes/Command";
import TurndownService from "turndown";
import request from "node-superfetch";
import { Message, MessageEmbed } from "discord.js";
import { DeclareCommand, constantly, hide } from "@yumeko/decorators";
import { MDNChildrenExpand } from "@yumeko/interfaces";

@DeclareCommand("mdn", {
    aliases: ["mdn", "mozilla-developer-network"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_MDN_DESCRIPTION"),
        usage: "mdn <query>",
        examples: ["mdn String"]
    },
    category: "utility",
    permissions: {
        client: ["EMBED_LINKS"]
    },
    args: [
        {
            identifier: "query",
            match: "rest",
            type: "string",
            prompt: (msg): string => msg.ctx.lang("COMMAND_MDN_PROMPT")
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { query }: { query: string }): Promise<Message> {
        const result = await this.getResult(query);
        if (!result || !result.url || !result.title || !result.summary) return msg.ctx.send(msg.ctx.lang("COMMAND_UTIL_NO_RESULT_FOUND"));
        const summary = new TurndownService()
            .addRule("hyperlink", {
                filter: "a",
                replacement: (text, node: any) => `[${text}](https://developer.mozilla.org${node.href})`
            })
            .turndown(result.summary.replace(/<code><strong>(.+)<\/strong><\/code>/g, "<strong><code>$1</code></strong>"));
        const embed = new MessageEmbed()
            .setColor(0x066FAD)
            .setAuthor("MDN", "https://i.imgur.com/DFGXabG.png", "https://developer.mozilla.org/")
            .setURL(`https://developer.mozilla.org${result.url}`)
            .setTitle(result.title)
            .setDescription(summary);
        return msg.ctx.send(embed);

    }

    @constantly
    public async getResult(query: string): Promise<MDNChildrenExpand|undefined> {
        const result = await this.search(query.replace(/#/g, ".prototype."));
        if (!result) return undefined;
        const { body }: any = await request.get(`${result}$children?expand`);
        return body;
    }

    @hide
    private async search(query: string): Promise<string|void> {
        const { text } = await request.get("https://duckduckgo.com")
            .query("q", `! site:developer.mozilla.org ${query}`);
        const match = text.match(/https%3A%2F%2Fdeveloper\.mozilla\.org%2F.+(?='><\/head>)/g);
        if (!match) return undefined;
        return decodeURIComponent(match[0]);
    }
}