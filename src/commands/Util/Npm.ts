import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import moment from "moment";
import { DeclareCommand } from "@yumeko/decorators";
import { Message, MessageEmbed } from "discord.js";
import { NPMResponse } from "@yumeko/interfaces";
import { trimArray } from "@yumeko/util/Util";

@DeclareCommand("npm", {
    aliases: ["npm", "yarn"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_NPM_DESCRIPTION"),
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
            prompt: (msg): string => msg.ctx.lang("COMMAND_NPM_PROMPT"),
            type: "string"
        }
    ]
})
export default class extends Command {
    public async exec(msg: Message, { query }: { query: string }): Promise<Message|void> {
        const yarn = msg.cmd ? msg.cmd.toLowerCase() === "yarn" : false;
        query = query.replace(/ +/g, "+");
        const result = await this.getResult(query, yarn);
        if (!result) return msg.ctx.send(msg.ctx.lang("COMMAND_UTIL_NO_RESULT_FOUND"));
        const version = result.versions[result["dist-tags"].latest];
        let deps = version.dependencies ? Object.keys(version.dependencies).map(x => `\`${x}\``) : [];
        let maintainers = result.maintainers.map((x: any) => `\`${x.name}\``);
        if (deps.length > 10) deps = trimArray(deps, msg.ctx.lang("COMMAND_UTIL_TRIM_ARRAY_PATTERN"));
        if (maintainers.length > 10) maintainers = trimArray(maintainers, msg.ctx.lang("COMMAND_UTIL_TRIM_ARRAY_PATTERN"));
        const embed = new MessageEmbed()
            .setURL(`https://${yarn ? "yarnpkg.com/en/package" : "www.npmjs.com"}/${result.name}`)
            .setTitle(result.name)
            .setColor(yarn ? 0x2188B6 : 0xCB0000)
            .setAuthor(yarn ? "YARN" : "NPM", yarn ? "https://yarnpkg.com/icons/icon-512x512.png" : "https://i.imgur.com/ErKf5Y0.png")
            .setDescription(msg.ctx.lang("COMMAND_NPM_PARSE", [
                result.description || msg.ctx.lang("COMMAND_NPM_NO_DESC"),
                result["dist-tags"].latest,
                result.license ? result.license : msg.ctx.lang("COMMAND_NPM_UNKNOWN"),
                result.author ? result.author.name : msg.ctx.lang("COMMAND_NPM_UNKNOWN"),
                result.time ? moment(result.time.modified).format("DD-MM-YYYY") : msg.ctx.lang("COMMAND_NPM_UNKNOWN"),
                deps.length ? deps.join(", ") : msg.ctx.lang("COMMAND_NPM_NO_DEPENDENCIES"),
                maintainers.join(", "),
                version.dist.tarball
            ]));
        msg.ctx.send(embed);
    }

    public async getResult(query: string, yarn: boolean): Promise<NPMResponse|void> {
        try {
            const { body }: any = await request.get(`https://registry.${yarn ? "yarnpkg" : "npmjs"}.com/${query}`);
            return body;
        } catch(e) {
            return undefined;
        }
    }
}