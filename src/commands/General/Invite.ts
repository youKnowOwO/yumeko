import type YumekoClient from "../../classes/Client";
import Command from "../../classes/Command";
import { MessageEmbed, Message } from "discord.js";

export default class InviteCommand extends Command {
    public constructor (client: YumekoClient) {
        super(client, "invite", {
            aliases: ["invite"],
            description: {
                content: "Invite the bot to your server",
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
            .setDescription(`[Click here](${inviteUrl}) to invite me to your server!`);
        return msg.ctx.send(embed);
    }
}