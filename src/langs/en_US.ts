import type { User } from "discord.js";


export default {
    META_NAME: (): string => "English (US)",
    META_ID: (): string => "en_US",
    COMMAND_RUNNER_ONLY_NSFW: (): string => "❌ **| This command only work on nsfw channel**",
    COMMAND_RUNNER_ONLY_ONE: (user: User): string => `**❌ | ${user}, Only one command per user**`,
    COMMAND_RUNNER_IN_COOLDOWN: (user: User, amount: number): string => `**⏱️ | ${user}, Calm down!.** You can use command again in \`${Math.round(amount)}\` second(s)`,
    COMMAND_RUNNER_MISSPERMS: (user: User, perm: string, isclient = false): string => `**❌ | ${isclient ? "Im" : `${user}, You`} require this permission(s) to run the command. ${perm}**`
};