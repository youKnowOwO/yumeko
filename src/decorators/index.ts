import type YumekoClient from "@yumeko/classes/Client";
import type Command from "@yumeko/classes/Command";
import CustomError from "@yumeko/classes/CustomError";
import type { Message } from "discord.js";
import { CommandOption } from "@yumeko/interfaces";

export function DeclareCommand (identifier: string, option: CommandOption) {
    return function<T extends Command>(target: new(...args: any[]) => T): new (client: YumekoClient) => T {
        return new Proxy(target, {
            construct: (ctx, [client]): T => new ctx(client, identifier, option)
        });
    };
}

export function inhibit<T extends (msg: Message, ...args: any[]) => Promise<string|void> | (string|void)>(func: T) {
    return function (_: unknown, __: string, descriptor: PropertyDescriptor): void {
        const method = descriptor.value;
        if (!method) throw new CustomError("DecoratorError", "Descriptor value isn'5 provided");
        descriptor.value = async function(msg: Message, ...args: any[]): Promise<any> {
            const message = await func(msg, ...args);
            if (message) {
                msg.ctx.send(message);
                throw new CustomError("CANCELED");
            }
            method.call(this, msg, ...args);
        };
    };
}

// Music

export function isMusicPlaying(): any {
    return inhibit((msg) => {
        if (!msg.guild!.music.song) return "💤 **| Not Playing anything right now**";
    });
}

export function isSameVoiceChannel(): any {
    return inhibit((msg) => {
        if (msg.guild!.me!.voice.channelID && msg.guild!.me!.voice.channelID !== msg.member!.voice.channelID)
            return "❌ **| You must use same voice channel with me**";
    });
}

export function isMemberInVoiceChannel(): any {
    return inhibit((msg) => {
        if (!msg.member!.voice.channelID) return "❌ **| Please Join Voice channel first**";
    });
}

export function isMemberVoiceChannelJoinable(ignoreWhenSame = true): any {
    return inhibit((msg) => {
        const vc = msg.member!.voice.channel!;
        if (ignoreWhenSame && msg.guild!.me!.voice.channelID && msg.guild!.me!.voice.channelID === msg.member!.voice.channelID) return undefined;
        if (!vc.permissionsFor(msg.guild!.me!)!.has(["CONNECT", "SPEAK"]))
            return "❌ **| I Don't have permissions \`CONNECT\` or \`SPEAK\`**";
        else if (!vc.joinable) return "❌ **| Voice channel isn't joinable**";
    });
}