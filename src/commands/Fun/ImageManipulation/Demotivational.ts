import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("demotivational", {
    aliases: ["demotivational", "dmotivation", "dmtvtnl"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_IMAGE_MANIPULATION_DEMOTIVATIONAL_DESCRIPTION"),
        usage: "demotivational <title> || <text> || [user|image]",
        examples: ["demotivational YOU CAN'T DO IT || BECAUSE YOU'RE SO USELESS"]
    },
    category: "fun",
    permissions: {
        client: ["ATTACH_FILES"]
    },
    splitBy: " || ",
    args: [
        {
            identifier: "title",
            match: "single",
            type: "string",
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_IMAGE_MANIPULATION_DEMOTIVATIONAL_PROMPT_1")
        },
        {
            identifier: "text",
            match: "single",
            type: "string",
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_IMAGE_MANIPULATION_DEMOTIVATIONAL_PROMPT_2")
        },
        {
            identifier: "image",
            match: "single",
            type: "image",
            default: (msg: Message): string => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { title, text, image } : { title: string; text: string; image: string }): Promise<Message> {
        const m = await msg.channel.send(msg.guild!.loc.get("COMMAND_FUN_PAINTING"));
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/demotivational")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ title, text, image });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "demotivational.png"}]});
    }
}