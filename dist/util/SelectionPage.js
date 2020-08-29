"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectionPage {
    constructor(msg, payload) {
        this.msg = msg;
        this.payload = payload;
    }
    async start() {
        const { selections, emojis, embed } = this.payload;
        if (selections.length < 2)
            return selections[0];
        const msg = await this.msg.channel.send(embed);
        for (let i = 0; i < selections.length; i++)
            await msg.react(emojis[i]);
        await msg.react(this.payload.cancelEmo);
        emojis.push(this.payload.cancelEmo);
        const filter = (msgr, usr) => emojis.includes(msgr.emoji.id || msgr.emoji.name) && usr.id === this.msg.author.id;
        const responses = await msg.awaitReactions(filter, { max: 1, time: 30000 });
        await msg.delete();
        if (!responses.size)
            return undefined;
        const emoji = responses.first().emoji.id || responses.first().emoji.name;
        if (emoji === this.payload.cancelEmo)
            return undefined;
        return selections[emojis.indexOf(emoji)];
    }
}
exports.default = SelectionPage;
