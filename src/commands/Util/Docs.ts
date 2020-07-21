import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import CustomError from "../../classes/CustomError";
import request from "node-superfetch";
import type { Message } from "discord.js";

const SOURCES = ["stable", "master", "rpc", "commando", "akairo", "akairo-master", "v11"];

export default class DocsCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "docs", {
            aliases: ["docs", "discord-js-docs", "djs"],
            description: {
                content: "Search the discord.js documentation",
                usage: "docs <query> [source] [--private] [--force]",
                examples: ["docs Client"]
            },
            category: "utility",
            permissions: {
                client: ["EMBED_LINKS"]
            },
            args: [
                {
                    identifier: "force",
                    match: "flag",
                    flag: "force"
                },
                {
                    identifier: "includePrivate",
                    match: "flag",
                    flag: "private"
                },
                {
                    identifier: "query",
                    match: "single",
                    prompt: "What query do you want to search?",
                    type:"string"
                },
                {
                    identifier: "source",
                    match: "single",
                    default: "master",
                    type: (_, content: string): string => {
                        content = content.toLowerCase();
                        if (!SOURCES.includes(content)) {
                            const mapped = SOURCES.map(x => `\`${x}\``).join(", ");
                            throw new CustomError("!PARSING", `**Only supported this sources, ${mapped}**`);
                        }
                        if (content === "v11") return "https://raw.githubusercontent.com/discordjs/discord.js/docs/v11.json";
                        return content;
                    }
                }
            ]
        });
    }

    public async exec(msg: Message, { query, source, force, includePrivate }: { query: string; source: string; force: boolean; includePrivate: boolean }): Promise<void> {
        const { body: embed }: any = await request.get("https://djsdocs.sorta.moe/v2/embed")
            .query({
                q: query,
                src: source,
                force, includePrivate
            } as any);
        if (!embed || !embed.description) msg.ctx.send("🚫 No result found");
        else msg.ctx.send({ embed });
    }
}