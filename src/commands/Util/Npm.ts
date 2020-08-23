import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";
import { trimArray } from "@yumeko/util/Util";

export default class NpmCommand extends Command {
    public constructor (client: YumekoClient) {
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

    public async exec(msg: Message, { query }: { query: string }): Promise<Message|void> {
        query = query.replace(/ +/g, "+");
        const result = await this.getResult(query);
        if (!result) return msg.ctx.send("🚫 No result found.");
        const version = result.versions[result["dist-tags"].latest];
        let deps = version.dependencies ? Object.keys(version.dependencies).map(x => `\`${x}\``) : [];
        let maintainers = result.maintainers.map((x: any) => `\`${x.name}\``);
        if (deps.length > 10) deps = trimArray(deps);
        if (maintainers.length > 10) maintainers = trimArray(maintainers);
        const embed = new MessageEmbed()
            .setURL(`https://www.npmjs.com/${query}`)
            .setTitle(result.name)
            .setColor("#CB0000")
            .setAuthor("NPM", "https://i.imgur.com/ErKf5Y0.png")
            .setDescription(stripIndents`
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

    public async getResult(query: string): Promise<any> {
        try {
            const { body } = await request.get(`https://registry.npmjs.com/${query}`);
            return body;
        } catch(e) {
            return undefined;
        }
    }
}