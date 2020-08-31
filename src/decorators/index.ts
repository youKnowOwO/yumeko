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
            await method.call(this, msg, ...args);
        };
    };
}

// Music

export function isMusicPlaying(): any {
    return inhibit(msg => {
        if (!msg.guild!.music.song) return msg.guild!.loc.get("COMMAND_MUSIC_NOT_PLAY");
    });
}

export function isSameVoiceChannel(): any {
    return inhibit(msg => {
        if (msg.guild!.me!.voice.channelID && msg.guild!.me!.voice.channelID !== msg.member!.voice.channelID)
            return msg.guild!.loc.get("COMMAND_MUSIC_NOT_SAME_VC", msg.guild!.me!.voice.channel!);
    });
}

export function isMemberInVoiceChannel(): any {
    return inhibit(msg => {
        if (!msg.member!.voice.channelID) return msg.guild!.loc.get("COMMAND_MUISC_MEMBER_NOT_VC");
    });
}

export function isMemberVoiceChannelJoinable(ignoreWhenSame = true): any {
    return inhibit(msg => {
        const vc = msg.member!.voice.channel!;
        if (ignoreWhenSame && msg.guild!.me!.voice.channelID && msg.guild!.me!.voice.channelID === msg.member!.voice.channelID) return undefined;
        if (!vc.permissionsFor(msg.guild!.me!)!.has(["CONNECT", "SPEAK"]))
            return msg.guild!.loc.get("COMMAND_MUSIC_LACK_PERM_CONNECT_OR_SPEAK");
        else if (!vc.joinable) return msg.guild!.loc.get("COMMAND_MUSIC_VC_NOT_JOINABLE");
    });
}

export function isInStream(): any {
    return inhibit(msg => {
        if (msg.guild!.music.song && msg.guild!.music.song.isStream)
            return msg.guild!.loc.get("COMMAND_MUSIC_CANT_PLAY_CAUSE_STREAM");
    });
}