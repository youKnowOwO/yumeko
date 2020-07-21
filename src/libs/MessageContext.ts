import { Collection, Snowflake, Message } from "discord.js";

export default class MessageContext {
    public cache: Collection<Snowflake, Message> = new Collection();

    public constructor(public lifeTime = 60000) {}
    // HELP: if someone known the type for TextChannel#send pls send PR
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public async send(msg: Message, content: any, options?: any): Promise<Message> {
        let message = this.cache.get(msg.id);
        if (!message) {
            message = await msg.channel.send(content, options);
            this.cache.set(msg.id, message);
            setTimeout(() => this.cache.delete(msg.id), this.lifeTime);
        } else {
            let toCheck = options;
            if (typeof content === "object") toCheck = content;
            if (toCheck && toCheck.files instanceof Array && toCheck.files.length) {
                await msg.channel.send(content, options);
                this.cache.set(msg.id, message);
            } else message.edit(content, options);
        }
        return message;
    }
}