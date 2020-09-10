"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const decorators_1 = require("@yumeko/decorators");
const discord_js_1 = require("discord.js");
const Util_1 = require("@yumeko/util/Util");
let NpmCommand = class NpmCommand extends Command_1.default {
    async exec(msg, { query }) {
        const yarn = msg.cmd ? msg.cmd.toLowerCase() === "yarn" : false;
        query = query.replace(/ +/g, "+");
        const result = await this.getResult(query);
        if (!result)
            return msg.ctx.send(msg.guild.loc.get("COMMAND_UTIL_NO_RESULT_FOUND"));
        const version = result.versions[result["dist-tags"].latest];
        let deps = version.dependencies ? Object.keys(version.dependencies).map(x => `\`${x}\``) : [];
        let maintainers = result.maintainers.map((x) => `\`${x.name}\``);
        if (deps.length > 10)
            deps = Util_1.trimArray(deps, msg.guild.loc.get("COMMAND_UTIL_TRIM_ARRAY_PATTERN"));
        if (maintainers.length > 10)
            maintainers = Util_1.trimArray(maintainers, msg.guild.loc.get("COMMAND_UTIL_TRIM_ARRAY_PATTERN"));
        const embed = new discord_js_1.MessageEmbed()
            .setURL(`https://${yarn ? "yarnpkg.com/en/package" : "www.npmjs.com"}/${result.name}`)
            .setTitle(result.name)
            .setColor(yarn ? 0x2188B6 : 0xCB0000)
            .setAuthor(yarn ? "YARN" : "NPM", yarn ? "https://yarnpkg.com/icons/icon-512x512.png" : "https://i.imgur.com/ErKf5Y0.png")
            .setDescription(msg.guild.loc.get("COMMAND_NPM_PARSE", [
            result.description || msg.guild.loc.get("COMMAND_NPM_NO_DESC"),
            result["dist-tags"].latest,
            result.license ? result.license : msg.guild.loc.get("COMMAND_NPM_UNKNOWN"),
            result.author ? result.author.name : msg.guild.loc.get("COMMAND_NPM_UNKNOWN"),
            result.time ? new Date(result.time.modified).toDateString() : msg.guild.loc.get("COMMAND_NPM_UNKNOWN"),
            deps.length ? deps.join(", ") : msg.guild.loc.get("COMMAND_NPM_NO_DEPENDENCIES"),
            maintainers.join(", "),
            version.dist.tarball
        ]));
        msg.ctx.send(embed);
    }
    async getResult(query, yarn = false) {
        try {
            const { body } = await node_superfetch_1.default.get(`https://registry.${yarn ? "yarnpkg" : "npmjs"}.com/${query}`);
            return body;
        }
        catch (e) {
            return undefined;
        }
    }
};
NpmCommand = __decorate([
    decorators_1.DeclareCommand("npm", {
        aliases: ["npm", "yarn"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_NPM_DESCRIPTION"),
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
                prompt: (msg) => msg.guild.loc.get("COMMAND_NPM_PROMPT"),
                type: "string"
            }
        ]
    })
], NpmCommand);
exports.default = NpmCommand;
