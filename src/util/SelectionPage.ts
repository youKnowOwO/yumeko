import type { Message, MessageReaction, User } from "discord.js";
import { SelectionPagePayload } from "../interfaces";

export default class SelectionPage<T>{
    public constructor(public msg: Message, public payload: SelectionPagePayload<T>) {}
    public async start(): Promise<T|void> {
        const { selections, emojis, embed } = this.payload;
        if(selections.length < 2) return selections[0];
        const msg = await this.msg.channel.send(embed);
        for(let i = 0; i < selections.length; i++) await msg.react(emojis[i]);
        await msg.react(this.payload.cancelEmo);
        emojis.push(this.payload.cancelEmo);
        const filter = (msgr: MessageReaction, usr: User): boolean => emojis.includes(msgr.emoji.id || msgr.emoji.name) && usr.id === this.msg.author.id;
        const responses = await msg.awaitReactions(filter, { max: 1, time: 30000 });
        await msg.delete();
        if(!responses.size) return undefined;
        const emoji = responses.first()!.emoji.id || responses.first()!.emoji.name;
        if(emoji === this.payload.cancelEmo) return undefined;
        return selections[emojis.indexOf(emoji)];
    }
}