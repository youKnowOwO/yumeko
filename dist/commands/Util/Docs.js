"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const SOURCES = ["stable", "master", "rpc", "commando", "akairo", "akairo-master", "v11"];
class DocsCommand extends Command_1.default {
    constructor(client) {
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
                    type: "string"
                },
                {
                    identifier: "source",
                    match: "single",
                    default: "master",
                    type: (_, content) => {
                        content = content.toLowerCase();
                        if (!SOURCES.includes(content)) {
                            const mapped = SOURCES.map(x => `\`${x}\``).join(", ");
                            throw new CustomError_1.default("!PARSING", `**Only supported this sources, ${mapped}**`);
                        }
                        if (content === "v11")
                            return "https://raw.githubusercontent.com/discordjs/discord.js/docs/v11.json";
                        return content;
                    }
                }
            ]
        });
    }
    async exec(msg, { query, source, force, includePrivate }) {
        const { body: embed } = await node_superfetch_1.default.get("https://djsdocs.sorta.moe/v2/embed")
            .query({
            q: query,
            src: source,
            force, includePrivate
        });
        return msg.ctx.send((embed && embed.description) ? { embed } : "🚫 No result found");
    }
}
exports.default = DocsCommand;
