import type YumekoClient from "../classes/Client";
import type Command from "../classes/Command";
import { CommandOption } from "../interfaces";

export function DeclareCommand (identifier: string, option: CommandOption) {
    return function<T extends Command>(target: new(...args: any[]) => T): new (client: YumekoClient) => T {
        return new Proxy(target, {
            construct: (ctx, [client]): T => new ctx(client, identifier, option)
        });
    };
}