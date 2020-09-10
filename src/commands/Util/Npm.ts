import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import { DeclareCommand } from "@yumeko/decorators";
import { Message, MessageEmbed } from "discord.js";
import { trimArray } from "@yumeko/util/Util";
import { NPMResponse } from "@yumeko/interfaces";

@DeclareCommand("npm", {
    aliases: ["npm", "yarn"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_NPM_DESCRIPTION"),
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
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_NPM_PROMPT"),
            type: "string"
        }
    ]
})
export default class NpmCommand extends Command {
    public async exec(msg: Message, { query }: { query: string }): Promise<Message|void> {
        const yarn = msg.cmd ? msg.cmd.toLowerCase() === "yarn" : false;
        query = query.replace(/ +/g, "+");
        const result = await this.getResult(query);
        if (!result) return msg.ctx.send(msg.guild!.loc.get("COMMAND_UTIL_NO_RESULT_FOUND"));
        const version = result.versions[result["dist-tags"].latest];
        let deps = version.dependencies ? Object.keys(version.dependencies).map(x => `\`${x}\``) : [];
        let maintainers = result.maintainers.map((x: any) => `\`${x.name}\``);
        if (deps.length > 10) deps = trimArray(deps, msg.guild!.loc.get("COMMAND_UTIL_TRIM_ARRAY_PATTERN"));
        if (maintainers.length > 10) maintainers = trimArray(maintainers, msg.guild!.loc.get("COMMAND_UTIL_TRIM_ARRAY_PATTERN"));
        const embed = new MessageEmbed()
            .setURL(`https://${yarn ? "yarnpkg.com/en/package" : "www.npmjs.com"}/${result.name}`)
            .setTitle(result.name)
            .setColor(yarn ? 0x2188B6 : 0xCB0000)
            .setAuthor(yarn ? "YARN" : "NPM", yarn ? "https://yarnpkg.com/icons/icon-512x512.png" : "https://i.imgur.com/ErKf5Y0.png")
            .setDescription(msg.guild!.loc.get("COMMAND_NPM_PARSE", [
                result.description || msg.guild!.loc.get("COMMAND_NPM_NO_DESC"),
                result["dist-tags"].latest,
                result.license ? result.license : msg.guild!.loc.get("COMMAND_NPM_UNKNOWN"),
                result.author ? result.author.name : msg.guild!.loc.get("COMMAND_NPM_UNKNOWN"),
                result.time ? new Date(result.time.modified).toDateString() : msg.guild!.loc.get("COMMAND_NPM_UNKNOWN"),
                deps.length ? deps.join(", ") : msg.guild!.loc.get("COMMAND_NPM_NO_DEPENDENCIES"),
                maintainers.join(", "),
                version.dist.tarball
            ]));
        msg.ctx.send(embed);
    }

    public async getResult(query: string, yarn = false): Promise<NPMResponse|void> {
        try {
            const { body }: any = await request.get(`https://registry.${yarn ? "yarnpkg" : "npmjs"}.com/${query}`);
            return body;
        } catch(e) {
            return undefined;
        }
    }
}