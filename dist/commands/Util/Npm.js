"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const Util_1 = require("@yumeko/util/Util");
class NpmCommand extends Command_1.default {
    constructor(client) {
        super(client, "npm", {
            aliases: ["npm", "g"],
            description: {
                content: "Search node modules on npm",
                usage: "npm <query>",
                examples: ["npm discord.js"]
            },
            category: "utility",
            permissions: {
                client: ["EMBED_LINKS"]
            },
            args: [
                {
                    identifier: "query",
                    match: "rest",
                    prompt: "What query do you want to search ?",
                    type: "string"
                }
            ]
        });
    }
    async exec(msg, { query }) {
        query = query.replace(/ +/g, "+");
        const result = await this.getResult(query);
        if (!result)
            return msg.ctx.send("🚫 No result found.");
        const version = result.versions[result["dist-tags"].latest];
        let deps = version.dependencies ? Object.keys(version.dependencies).map(x => `\`${x}\``) : [];
        let maintainers = result.maintainers.map((x) => `\`${x.name}\``);
        if (deps.length > 10)
            deps = Util_1.trimArray(deps);
        if (maintainers.length > 10)
            maintainers = Util_1.trimArray(maintainers);
        const embed = new discord_js_1.MessageEmbed()
            .setURL(`https://www.npmjs.com/${query}`)
            .setTitle(result.name)
            .setColor("#CB0000")
            .setAuthor("NPM", "https://i.imgur.com/ErKf5Y0.png")
            .setDescription(common_tags_1.stripIndents `
                > ${result.description || "No description"}
                Version: **${result["dist-tags"].latest}**
                License: **${result.license}**
                Author: **${result.author ? result.author.name : "Unknown"}**
                Modified: **${new Date(result.time.modified).toDateString()}**
                Dependencies: ${deps.length ? deps.join(", ") : "No dependencies"}
                Maitainers: ${maintainers.join(", ")}

                [Download](${version.dist.tarball})
            `);
        msg.ctx.send(embed);
    }
    async getResult(query) {
        try {
            const { body } = await node_superfetch_1.default.get(`https://registry.npmjs.com/${query}`);
            return body;
        }
        catch (e) {
            return undefined;
        }
    }
}
exports.default = NpmCommand;
