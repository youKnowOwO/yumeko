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
const Pagination_1 = __importDefault(require("@yumeko/util/Pagination"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
let default_1 = class extends Command_1.default {
    async exec(msg, { username }) {
        const { body } = await node_superfetch_1.default.get("https://instagram.hanifdwyputra.xyz/")
            .query({ username });
        if (!body.graphql)
            return msg.ctx.send("🚫 Username not found");
        const { user } = body.graphql;
        const embed = new discord_js_1.MessageEmbed()
            .setColor(0xCE0072)
            .setThumbnail(user.profile_pic_url_hd)
            .setAuthor(`${user.full_name} (@${username})${user.is_verified ? " ✔️" : ""}`, "https://www.instagram.com/static/images/ico/apple-touch-icon-180x180-precomposed.png/c06fdb2357bd.png", `https://www.instagram.com/${username}`)
            .addField("Followers", user.edge_followed_by.count, true)
            .addField("Follows", user.edge_follow.count)
            .addField("Posts", user.edge_owner_to_timeline_media.count);
        const desc = [];
        if (user.biography && user.biography.length)
            desc.push(`> ${user.biography.replace(/\n/g, "\n > ")}`);
        if (user.external_url && user.external_url.length)
            desc.push(`🌐 ${user.external_url}`);
        embed.setDescription(desc.join("\n"));
        msg.ctx.send(embed);
        embed.fields = [];
        const pages = user.edge_owner_to_timeline_media.edges
            .map((x) => ({
            caption: x.node.edge_media_to_caption.edges.map((y) => y.node ? y.node.text : "").join("\n"),
            image: x.node.thumbnail_src,
            link: `https://www.instagram.com/p/${x.node.shortcode}`
        }));
        if (pages.length)
            new Pagination_1.default(msg, {
                embed, pages,
                edit: (index, emb) => emb.setImage(pages[index].image).setURL(pages[index].link).setDescription(pages[index].caption).setFooter(`Post ${index + 1} / ${pages.length}`)
            }).start();
        return msg;
    }
};
default_1 = __decorate([
    decorators_1.DeclareCommand("instagram", {
        aliases: ["instagram", "ig"],
        description: {
            content: "See instagram user profile",
            usage: "instagram <username>",
            examples: ["instagram minecraft"]
        },
        permissions: {
            client: ["EMBED_LINKS", "ADD_REACTIONS"]
        },
        category: "utility",
        nsfw: true,
        args: [
            {
                identifier: "username",
                match: "rest",
                prompt: "Which user do you want to look up ?",
                type: (_, content) => content.toLowerCase().replace("@", "")
            }
        ]
    })
], default_1);
exports.default = default_1;
