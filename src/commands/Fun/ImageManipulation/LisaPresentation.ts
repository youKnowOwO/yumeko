import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("lisa-presentation", {
    aliases: ["lisa-presentation", "lisapresentation", "lisap"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_LISA_PRESENTATION_DESCRIPTION"),
        usage: "lisa-presentation <text>",
        examples: ["lisa-presentation idk"]
    },
    category: "fun",
    permissions: {
        client: ["ATTACH_FILES"]
    },
    args: [
        {
            identifier: "text",
            match: "rest",
            type: "string",
            prompt: (msg): string => msg.ctx.lang("COMMAND_IMAGE_MANIPULATION_LISA_PRESENTATION_PROMPT")
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message, { text } : { text: string }): Promise<Message> {
        const m = await msg.channel.send(msg.ctx.lang("COMMAND_FUN_PAINTING"));
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/lisa-presentation")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ text });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "lisa-presentation.png"}]});
    }
}