import Command from "@yumeko/classes/Command";
import request from "node-superfetch";
import type { Message } from "discord.js";
import { DeclareCommand, constantly } from "@yumeko/decorators";

@DeclareCommand("gru-plan", {
    aliases: ["gru-plan"],
    description: {
        content: (msg): string => msg.guild!.loc.get("COMMAND_IMAGE_MANIPULATION_GRUPLAN_DESCRIPTION"),
        usage: "gru-plan <firstStep> || <secondStep> || <thirdStep>",
        examples: ["gru-plan I don't know || about || this meme"]
    },
    category: "fun",
    permissions: {
        client: ["ATTACH_FILES"]
    },
    splitBy: " || ",
    args: [
        {
            identifier: "firstStep",
            match: "single",
            type: "string",
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_IMAGE_MANIPULATION_GRUPLAN_PROMPT_1")
        },
        {
            identifier: "secondStep",
            match: "single",
            type: "string",
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_IMAGE_MANIPULATION_GRUPLAN_PROMPT_2")
        },
        {
            identifier: "thirdStep",
            match: "single",
            type: "string",
            prompt: (msg): string => msg.guild!.loc.get("COMMAND_IMAGE_MANIPULATION_GRUPLAN_PROMPT_3")
        }
    ]
})
export default class extends Command {
    @constantly
    public async exec(msg: Message,{ firstStep, secondStep, thirdStep }: { firstStep: string; secondStep: string; thirdStep: string }): Promise<Message> {
        const m = await msg.channel.send(msg.guild!.loc.get("COMMAND_FUN_PAINTING"));
        const { raw: attachment } = await request.get("https://emilia-api.xyz/api/gru-plan")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ firstStep, secondStep, thirdStep });
        m.delete();
        return msg.ctx.send({files:[{attachment, name: "gru-plan.png"}]});
    }
}