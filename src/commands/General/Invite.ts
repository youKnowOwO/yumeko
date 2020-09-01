import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import { MessageEmbed, Message } from "discord.js";

export default class InviteCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "invite", {
            aliases: ["invite"],
            description: {
                content: (msg): string => msg.guild!.loc.get("COMMAND_INVITE_DESCRIPTION"),
                usage: "invite",
                examples: ["invite"]
            },
            permissions: {
                client: ["EMBED_LINKS"]
            },
            category: "general",
        });
    }

    public async exec(msg: Message): Promise<Message> {
        const inviteUrl = await this.client.generateInvite(["ATTACH_FILES", "EMBED_LINKS", "CONNECT", "SPEAK", "ADD_REACTIONS", "SEND_MESSAGES", "MANAGE_MESSAGES"]);
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(msg.guild!.loc.get("COMMAND_INVITE_CLICK_HRER", inviteUrl));
        return msg.ctx.send(embed);
    }
}