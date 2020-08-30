import type { User, GuildMember } from "discord.js";
import { stripIndents } from "common-tags";
import { RandomAnimeResponse } from "@yumeko/interfaces";

export default {
    // META
    META_NAME: (): string => "English (US)",
    META_ID: (): string => "en_US",
    META_EMOJI: (): string => "🇺🇲",

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
    ARGUMENT_PARSER_NOT_UNDERSTAND: (user: User): string => `**🤷 | ${user}, Look like you don't know how to run this command.**`,

    // TYPE
    TYPE_CODE_NOT_FOUND: (): string => "**Please contain a codeblock. like:** ```this```",

    TYPE_COMMAND_HAS_SIMILIAR: (content: string, similiar: string): string => `**\`${content}\` isn't exist.** ${similiar.length ? `Did you mean one of thess ? ${similiar}` : ""}`,

    TYPE_IMAGE_SIZE_EXCEDED: (): string => "**Maximum file size is `8MB`**",
    TYPE_IMAGE_UNSUPPORTED_EXT: (): string => "**Unsupported file type. supported: `PNG`, `JPG`, `BMP`, `GIF`**`",

    TYPE_MEMBER_NOT_FOUND: (): string => "Cannot found member. Please insert right type!",
    TYPE_MEMBER_HAS_SIMILIAR: (memberlist: string): string => `Please more specify spelling member name. like: ${memberlist}`,

    TYPE_HUMAN_BOT: (): string => "**Bot not allowed!**",
    TYPE_HUMAN_SELF: (): string => "**You can't choose yourselft**",

    TYPE_NUMBER_NOT_FOUND: (content: string): string => `**\`${content}\` isn't even a number**`,

    TYPE_TIMESPAN_NOT_FOUND: (): string => "**Cannot determine that time position.**",

    TYPE_URL_NOT_FOUND: (): string => "**Invalid URL**",

    // COMMAND
    // ANIMAL
    COMMAND_ANIMAL_CLICK_HERE: (): string => "Click here if image failed to load",

    // FUN
    COMMAND_FUN_PAINTING: (): string => "🖌️ **| Painting...**",

    COMMAND_8BALL_DESCRIPTION: (): string => "Ask to the magic 8ball",
    COMMAND_8BALL_PROMPT: (): string => "What question do you want to ask  ?",

    COMMAND_BANANA_DESCRIPTION: (): string => "See user banana length",
    COMMAND_BANANA_LENGTH: (member: GuildMember, length: number): string => `🍌 **| \`${member.displayName}\` banana length is \`${length}cm\`**`,

    COMMAND_CHUCKNORRIS_DESCRIPTION: (): string => "Get random Chuck Norris joke",

    COMMAND_DADJOKE_DESCRIPTION: (): string => "Get random dad joke",

    COMMAND_FORTUNE_COOKIE_DESCRIPTION: (): string => "crack your cookie and get the fortune.",

    COMMAND_RANDOM_ANIME_DESCRIPTION: (): string => "Completely show you random anime",
    COMAMND_RANDOM_ANIME_PARSE_RESPONSE: (body: RandomAnimeResponse): string => stripIndents`
        Score: **${body.avg_score}**
        Episodes: **${body.episodes}**
        Duration: **${body.eps_duration}**
        Release: **${body.release_date}**
        Season: **${body.season}**
        Rating: **${body.rating}**
        Source: **${body.source}**
        Genres: ${body.genres.map(x => `\`${x}\``).join(", ")}
    `,
    COMMAND_RANDOM_ANIME_PARSE_WATCH: (): string => "Watch",

    COMMAND_SHIP_DESCRIPTION: (): string => "ship two user ❤️",
    COMAMND_SHIP_PROMPT: (): string =>  "Which user do you want to ship it?",
};