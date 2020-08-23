import Command from "@yumeko/classes/Command";
import Pagination from "@yumeko/util/Pagination";
import request from "node-superfetch";
import { Message, MessageEmbed } from "discord.js";
import { DeclareCommand } from "@yumeko/decorators";

@DeclareCommand("instagram", {
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
    args: [
        {
            identifier: "username",
            match: "rest",
            prompt: "Which user do you want to look up ?",
            type: (_, content: string): string => content.toLowerCase().replace("@", "")
        }
    ]
})
export default class InstagramCommand extends Command {
    public async exec(msg: Message, { username }: { username: string }): Promise<Message> {
        const { body }: any = await request.get("https://instagram.hanifdwyputra.xyz/")
            .query({ username });
        if (!body.graphql) return msg.ctx.send("🚫 Username not found");
        const { user } = body.graphql;
        const embed = new MessageEmbed()
            .setColor(0xCE0072)
            .setThumbnail(user.profile_pic_url_hd)
            .setAuthor(`${user.full_name} (@${username})${user.is_verified ? " ✔️" : ""}`, "https://www.instagram.com/static/images/ico/apple-touch-icon-180x180-precomposed.png/c06fdb2357bd.png", `https://www.instagram.com/${username}`)
            .addField("Followers", user.edge_followed_by.count, true)
            .addField("Follows", user.edge_follow.count)
            .addField("Posts", user.edge_owner_to_timeline_media.count);
        const desc: string[] = [];
        if (user.biography && user.biography.length) desc.push(`> ${user.biography.replace(/\n/g, "\n > ")}`);
        if (user.external_url && user.external_url.length) desc.push(`🌐 ${user.external_url}`);
        embed.setDescription(desc.join("\n"));
        msg.ctx.send(embed);
        embed.fields = [];
        const pages = user.edge_owner_to_timeline_media.edges
            .map((x: any): any => ({
                caption: x.node.edge_media_to_caption.edges.map((y: any): string => y.node ? y.node.text : "").join("\n"),
                image: x.node.thumbnail_src,
                link: `https://www.instagram.com/p/${x.node.shortcode}`
            }));
        if (pages.length) new Pagination(msg, {
            embed, pages,
            edit: (index, emb): MessageEmbed => emb.setImage(pages[index].image).setURL(pages[index].link).setDescription(pages[index].caption).setFooter(`Post ${index + 1} / ${pages.length}`)
        }).start();
        return msg;
    }
}