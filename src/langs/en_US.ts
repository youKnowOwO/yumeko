import type { User, GuildMember, VoiceChannel } from "discord.js";
import { stripIndents } from "common-tags";
import { RandomAnimeResponse, DataNowplayMoe } from "@yumeko/interfaces";
import YumekoClient from "@yumeko/classes/Client";

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
    COMMAND_RANDOM_ANIME_PARSE_RESPONSE: (body: RandomAnimeResponse): string => stripIndents`
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
    COMMAND_SHIP_PROMPT: (): string =>  "Which user do you want to ship it?",

    COMMAND_GAME_VERIFY_WAIT: (user: User): string => `❓ **| ${user}, Do you want accept this challenge ?**`,
    COMMAND_GAME_VERIFY_NOT_ACCEPT: (user: User, offerWithClient = false): string => `🍃 **| Look like ${user} doesn't accept your challenge.${offerWithClient ? " Do you want to play it with me anyway ?" : ""}**`,
    COMMAND_GAME_VERIFY_DECLINE_OFFER: (): string => "✋ **| Ok see you next time**",

    COMMAND_GAME_LIST_PREPARING: (): string => "🖌️ **| Preparing...**",
    COMMAND_GAME_LIST_TURN: (user: User): string => `${user}, Turn!`,
    COMMAND_GAME_LIST_CONGRATS: (user: User): string => `🎉 **| Congrats ${user} you won the match!**`,
    COMMAND_GAME_LIST_DRAW: (): string => "🇴 **| Draw!**",
    COMMAND_GAME_LIST_TIMEOUT: (): string => "⏱️ **| Timeout**",
    COMMAND_GAME_LIST_WRONG: (value: unknown): string => `❌ **| Too Bad it was \`${value}\`**`,
    COMMAND_GAME_LIST_RIGHT: (value: unknown): string => `✅ **| You're right! it was \`${value}\`**`,

    COMMAND_GAME_LIST_DESCRIPTION: (): string => "See the list of mini game i had",
    COMMAND_GAME_LIST_NOT_FOUND: (): string => "Mini game not found",
    COMMAND_GAME_LIST_ONLY_ONE: (): string => "❕ **| Only one game per channel**",
    COMMAND_GAME_LIST_INFO: (prefix: string): string => `To play a game type '${prefix}game <game cmd>'`,

    COMMAND_GAME_CONNECT4_DESCRIPTION: (): string => "Play Connect4 game with other user. This is solved game, you must drop 4 marks horizontal vertical or diagonal to win the match.",

    COMMAND_GAME_GUESS_THE_NUMBER_DESCRIPTION: (): string =>  "Play Guess the Number Game!. This game is game of luck, i'll pick random number and you must guess it.",
    COMMAND_GAME_GUESS_THE_NUMBER_START: (): string => "❓ **| Guess the number started. you can guessing now!**",
    COMMAND_GAME_GUESS_THE_NUMBER_HIGHER: (num: number): string => `🔼 **| The number is higher than \`${num}\`**`,
    COMMAND_GAME_GUESS_THE_NUMBER_SHORTER: (num: number): string => `🔽 **| The number is shorter than \`${num}\`**`,

    COMMAND_GANE_HANGMAN_DESCRIPTION: (): string => "Save hanged man by guessing the word!. I'll hang random man and if you to want to safe him, just guess the word",

    COMMAND_GAME_MINESWEEPER_DESCRIPTION: (): string => "Your luck will be tested here. Its just a simple game, clear the lane without dough a bomb.",
    COMMAND_GAME_MINESWEEPER_DOUGH_BOMB: (): string => "❌ **| Lose, you dough a bomb**",
    COMMAND_GAME_MINESWEEPER_WIN: (): string => "🎉 **| Congrats, you clear lane without dough a bomb!**",

    COMMAND_GAME_TICTACTOE_DESCRIPTION: (): string => "Play Tic Tac Toe game with other user. This is solved game, you must placing 3 marks horizontal vertical or diagonal to win the match.",

    COMMAND_GAME_TRIVIA_DESCRIPTION: (): string => "Test your knowledge with random question!. Ill give you some random questions and you must answer it.",

    COMMAND_GAME_WORD_CHAIN_DESCRIPTION: (): string => "This game is able to train your vocabulary, by making a word from the last letter of the previous word",

    // GENERAL
    COMMAND_ABOUT_DESCRIPTION: (): string => "About me.",
    COMMAND_ABOUT_ABOUTME: (user: User, client: YumekoClient, commands: YumekoClient["collector"]["commands"]): string => stripIndents`
        👋 | Hi there, ${user}! I’m **${client.user!.tag}** and I’m beyond happy and  glad to meet you! 
        I’m just an ordinary bot whose job is to make your Discord Server more fun and exciting
        for members to chat on. I do what other bots do as well, like: sending random images of animals, 
        generating games for this server’s members, and most importantly, I play and queue song requests. 
        To conclude, I carry \`${commands.filter(x => user.isDev || !x.option.devOnly).size}\` commands in total. To test me out, 
        why not start by generating my help panel? **${client.config.prefix}help**.
    `,

    COMMAND_HELP_DESCRIPTION: (): string => "The first command you'll typing",
    COMMAND_HELP_PARSE_DESC: (usage: string, aliases: string[], cooldown: number): string => stripIndents`
        **Usage:** \`${usage}\`
        **Aliases:** ${aliases.map(x => `\`${x}\``)}
        **Cooldown:** \`${cooldown} seconds\`
    `,
    COMMAND_HELP_PARSE_EXAMPLES: (): string => "Examples",
    COMMAND_HELP_INFO_ARGS: (): string => "ℹ️ Don't include <> or []. <> means required, and [] means optional.",
    COMMAND_HELP_INFO_EXPLAIN: (prefix: string): string => `ℹ️ To learn more about a specific command, do ${prefix}help <command name>`,

    COMMAND_INVITE_DESCRIPTION: (): string => "Invite the bot to your server",
    COMMAND_INVITE_CLICK_HRER: (inviteUrl: string): string => `[Click here](${inviteUrl}) to invite me to your server!`,

    COMMAND_SAY_DESCRIPTION: (): string => "Let me repeat what you want",
    COMMAND_SAY_PROMPT: (): string => "What text do you want me to repeaat ?",

    COMMAND_STATS_DESCRIPTION: (): string => "Show my current statistic",

    // Music
    COMMAND_MUSIC_PLAYING: (song: string): string => `🎶 **Now Playing:** __**${song}**__`,
    COMMAND_MUSIC_GET_EXCEPTION: (stack: string): string => `❌ **| Im getting exception while playing this song** ${stack}`,
    COMMAND_MUSIC_NOT_PLAY: (): string => "💤 **| Not Playing anything right now**",
    COMMAND_MUSIC_NOT_SAME_VC: (vc: VoiceChannel): string => `❌ **| You must in ${vc}**`,
    COMMAND_MUISC_MEMBER_NOT_VC: (): string => "❌ **| Please Join Voice channel first**",
    COMMAND_MUSIC_LACK_PERM_CONNECT_OR_SPEAK: (): string => "❌ **| I Don't have permissions \`CONNECT\` or \`SPEAK\`**",
    COMMAND_MUSIC_VC_NOT_JOINABLE: (): string => "❌ **| Voice channel isn't joinable**",
    COMMAND_MUSIC_CANT_PLAY_CAUSE_STREAM: (): string => "❌ **| You can't do this! because Music Player currently in stream mode.**",

    COMMAND_MUISC_LOOP_DESCRIPTION: (): string => "Loop current queue",
    COMMAND_MUSIC_LOOP_ON: (): string => "🔁 **| Looping current queue**",
    COMMAND_MUISC_LOOP_OFF: (): string => "🔁 **| Disabled**",

    COMMAND_MUSIC_LYRICS_DESCRIPTION: (): string => "Get lyrics from query based",

    COMMAND_MUSIC_NP_DESCRIPTION: (): string => "What song is playing right now ?",
    COMMAND_MUSIC_NP_MOE_PARSE: (data: DataNowplayMoe): string => stripIndents`
        Artist(s): **${data.artists}**
        Album(s): **${data.albums || "None"}**
        Listener(s): **${data.listeners}**
        Source: **${data.source || "None"}**
        Requester: **${data.requester || "None"}** ${data.event ? `\`${data.event.name}\`` : ""}
    `,

    COMMAND_MUSIC_PAUSE_DESCRIPTION: (): string => "Pause or resume current song",
    COMMAND_MUSIC_PAUSE_ON: (): string => "⏸️ **| Paused**",
    COMMAND_MUSIC_PAUSE_OFF: (): string => "▶️ **| Resumed**",

    COMMAND_MUSIC_PLAY_DESCRIPTION: (): string => "Play some songs",
    COMMAND_MUSIC_PLAY_PROMPT: (): string => "What song do you wany to play ?",
    COMMAND_MUSIC_PLAY_ADD_PLAYLIST: (name: string): string => `✅ **| Succes Added Playlist:** __**${name}**__`,
    COMMAND_MUSIC_PLAY_ADD_SONG: (name: string): string => `✅ **| Added to queue:** __**${name}**__`,
    COMMAND_MUSIC_PLAY_SONG_SELECTION: (): string => "Songs Selection",

    COMMAND_MUSIC_PLAYMOE_DESCRIPTION: (): string => "Play radio from listen.moe",
    COMMAND_MUSIC_PLAYMOE_PROMPT: (): string => "Which radio culture do you want to select, `jpop` or `kpop` ?",
    COMMAND_MUSIC_PLAYMOE_INVALID_TYPE: (): string => "**Only `jpop` or `kpop` allowed!**",
    COMMAND_MUSIC_PLAYMOE_INHIBIT: (): string => "❌ **| You can't do this!. Because Music Player is in use**",

    COMMAND_MUSIC_QUEUE_DESCRIPTION: (): string => "Show the list of song that will play",

    COMMAND_MUSIC_REPEAT_DESCRIPTION: (): string => "repeat current queue",
    COMMAND_MUSIC_REPEAT_ON: (): string => "🔁 **| repeating current song.**",
    COMMAND_MUSIC_REPEAT_OFF: (): string => "🔁 **| Disabled.**",

    COMMAND_MUSIC_SEEK_DESCRIPTION: (): string => "Jump to position what you want",
    COMMAND_MUSIC_SEEK_PROMPT: (): string => "What time position do you want jump to ?",
    COMMAND_MUSIC_SEEK_NOT_SEEKABLE: (): string => "❌ **| This song isn't seekable**",
    COMMAND_MUSIC_SEEK_TOO_LONG_OR_SHORT: (): string => "❌ **| Time position is too long or short**",
    COMMAND_MUSIC_SEEK_SEEKED: (to: string): string => `⏱️ **| Seeked to \`${to}\`**`,

    COMMAND_MUSIC_SHUFFLE_DESCRIPTION: (): string => "shuffle curent queue",
    COMMAND_MUSIC_SHUFFLE_SHUFFLED: (): string => "🔀 **| Queue shuffled**",

    COMMAND_MUSIC_SKIP_DESCRIPTION: (): string => "Stop playing current song",
    COMMAND_MUSIC_SKIP_ALREADY_VOTE: (): string => "❕ **| You already voted**",
    COMMAND_MUSIC_SKIP_NEED_MORE_VOTE: (now: number, needed: number): string => `📢 **| You voted for skip this song, need more votes! **${now} / ${needed}**`,
    COMMAND_MUSIC_SKIP_SKIPPED: (): string => "⏭️ **| Skipped**",

    COMMAND_MUSIC_STOP_DESCRIPTION: (): string => "Clear all song in queue. and stop current song",
    COMMAND_MUSIC_STOP_STOPPED: (): string => "🛑 **| Stopped**",

    COMMAND_MUSIC_VOLUME_DESCRIPTION: (): string => "Stop playing current song",
    COMMAND_MUSIC_VOLUME_PROMPT: (): string => "How many volume do you want to change ?",
    COMMAND_MUSIC_VOLUME_TOO_HIGH: (): string => "**Volume is too high. max \`120\`**",
    COMMAND_MUSIC_VOLUME_TOO_LOW: (): string => "**Volume is too low. min \`0\`**",
    COMMAND_MUSIC_VOLUME_CHANGE: (to: number): string => `🔉 **| Change Volume to \`${to}\`**`,

    // UTIL
    COMMAND_UTIL_NO_RESULT_FOUND: (): string => "🚫 **| No result found.**",
};