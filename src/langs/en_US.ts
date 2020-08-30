import type { User } from "discord.js";
import { stripIndents } from "common-tags";


export default {
    // META
    META_NAME: (): string => "English (US)",
    META_ID: (): string => "en_US",

    // COMMAND RUNNER
    COMMAND_RUNNER_ONLY_NSFW: (): string => "❌ **| This command only work on nsfw channel**",
    COMMAND_RUNNER_ONLY_ONE: (user: User): string => `**❌ | ${user}, Only one command per user**`,
    COMMAND_RUNNER_IN_COOLDOWN: (user: User, amount: number): string => `**⏱️ | ${user}, Calm down!.** You can use command again in \`${Math.round(amount)}\` second(s)`,
    COMMAND_RUNNER_MISSPERMS: (user: User, perm: string, isclient = false): string => `**❌ | ${isclient ? "Im" : `${user}, You`} require this permission(s) to run the command. ${perm}**`,
    COMMAND_RUNNER_ERROR: (stack: string): string => `**🚫 | Sorry my devs really bad.** ${stack}`,

    // ARGUMENT PARSER
    ARGUMENT_PARSER_PROMPT: (sign: string, prompt: string): string => stripIndents`
        **${sign} |** ${prompt}
        **▫️ |** *You've \`30\` seconds to decide*
        **▫️ | ** *You can type \`cancel\` to cancel.*
        **▫️ | ** *Or if you want to type cancel use \`|cancel|\` instead*
    `,
    ARGUMENT_PARSER_CANCELED: (): string => "👌 **| Canceled**",
    ARGUMENT_PARSER_NOT_UNDERSTAND: (user: User): string => `**🤷 | ${user}, Look like you don't know how to run this command.**`
};