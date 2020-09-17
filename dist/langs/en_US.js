"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animals = void 0;
const common_tags_1 = require("common-tags");
var Animals;
(function (Animals) {
    Animals[Animals["birb"] = 0] = "birb";
    Animals[Animals["bunny"] = 1] = "bunny";
    Animals[Animals["cat"] = 2] = "cat";
    Animals[Animals["dog"] = 3] = "dog";
    Animals[Animals["duck"] = 4] = "duck";
    Animals[Animals["fox"] = 5] = "fox";
    Animals[Animals["kangaroo"] = 6] = "kangaroo";
    Animals[Animals["koala"] = 7] = "koala";
    Animals[Animals["lizard"] = 8] = "lizard";
    Animals[Animals["owl"] = 9] = "owl";
    Animals[Animals["panda"] = 10] = "panda";
    Animals[Animals["racoon"] = 11] = "racoon";
    Animals[Animals["shiba"] = 12] = "shiba";
})(Animals = exports.Animals || (exports.Animals = {}));
exports.default = {
    META_NAME: () => "English (US)",
    META_ID: () => "en_US",
    META_EMOJI: () => "🇺🇲",
    COMMAND_RUNNER_ONLY_NSFW: () => "❌ **| This command only work on nsfw channel**",
    COMMAND_RUNNER_ONLY_ONE: (user) => `**❌ | ${user}, Only one command per user**`,
    COMMAND_RUNNER_IN_COOLDOWN: (user, amount) => `**⏱️ | ${user}, Calm down!.** You can use command again in \`${Math.round(amount)}\` second(s)`,
    COMMAND_RUNNER_MISSPERMS: (user, perm, isclient = false) => `**❌ | ${isclient ? "Im" : `${user}, You`} require this permission(s) to run the command. ${perm}**`,
    COMMAND_RUNNER_ERROR: (stack) => `**🚫 | Sorry my devs really bad.** ${stack}`,
    ARGUMENT_PARSER_PROMPT: (sign, prompt) => common_tags_1.stripIndents `
        **${sign} |** ${prompt}
        **▫️ |** *You've \`30\` seconds to decide*
        **▫️ | ** *You can type \`cancel\` to cancel.*
        **▫️ | ** *Or if you want to type cancel use \`|cancel|\` instead*
    `,
    ARGUMENT_PARSER_CANCELED: () => "👌 **| Canceled**",
    ARGUMENT_PARSER_NOT_UNDERSTAND: (user) => `**🤷 | ${user}, Look like you don't know how to run this command.**`,
    TYPE_CODE_NOT_FOUND: () => "**Please contain a codeblock. like:** ```this```",
    TYPE_COMMAND_HAS_SIMILIAR: (content, similiar) => `**\`${content}\` isn't exist.** ${similiar.length ? `Did you mean one of thess ? ${similiar}` : ""}`,
    TYPE_IMAGE_SIZE_EXCEDED: () => "**Maximum file size is `8MB`**",
    TYPE_IMAGE_UNSUPPORTED_EXT: () => "**Unsupported file type. supported: `PNG`, `JPG`, `BMP`, `GIF`**`",
    TYPE_MEMBER_NOT_FOUND: () => "Cannot found member. Please insert right type!",
    TYPE_MEMBER_HAS_SIMILIAR: (memberlist) => `Please more specify spelling member name. like: ${memberlist}`,
    TYPE_HUMAN_BOT: () => "**Bot not allowed!**",
    TYPE_HUMAN_SELF: () => "**You can't choose yourselft**",
    TYPE_NUMBER_NOT_FOUND: (content) => `**\`${content}\` isn't even a number**`,
    TYPE_TIMESPAN_NOT_FOUND: () => "**Cannot determine that time position.**",
    TYPE_URL_NOT_FOUND: () => "**Invalid URL**",
    COMMAND_LANGUAGE_DESCRIPTION: () => "Set my langguage",
    COMMAND_LANGUAGE_NOT_FOUND: (key) => `**No language found with key \`${key}\`**`,
    COMMAND_LANGUAGE_SET: (to, toEmote) => `${toEmote} **| Language set to \`${to}\`**`,
    COMMAND_LANGUAGE_LIST: (prefix, list, current, currentEmote) => common_tags_1.stripIndents `
        ${currentEmote} **| Current Language \`${current}\`**

        __**Language List**__
        ${list}

        *To set the language use \`${prefix}language <id | lang>\`*
    `,
    COMMAND_PREFIX_DESCRIPTION: () => "Set guild prefix",
    COMMAND_PREFIX_CURRENT: (prefix) => `❗ **| My current prefix is \`${prefix}\`**`,
    COMMAND_PREFIX_SET_TO: (prefix) => `❗ **| Prefix set to \`${prefix}\`**`,
    COMMAND_ANIMAL_DESCRIPTION: (id) => `Random ${Animals[id]} image.`,
    COMMAND_ANIMAL_CLICK_HERE: () => "Click here if image failed to load",
    COMMAND_FUN_PAINTING: () => "🖌️ **| Painting...**",
    COMMAND_8BALL_DESCRIPTION: () => "Ask to the magic 8ball",
    COMMAND_8BALL_PROMPT: () => "What question do you want to ask  ?",
    COMMAND_BANANA_DESCRIPTION: () => "See user banana length",
    COMMAND_BANANA_LENGTH: (member, length) => `🍌 **| \`${member.displayName}\` banana length is \`${length}cm\`**`,
    COMMAND_CHUCKNORRIS_DESCRIPTION: () => "Get random Chuck Norris joke",
    COMMAND_DADJOKE_DESCRIPTION: () => "Get random dad joke",
    COMMAND_FORTUNE_COOKIE_DESCRIPTION: () => "crack your cookie and get the fortune.",
    COMMAND_RANDOM_ANIME_DESCRIPTION: () => "Completely show you random anime",
    COMMAND_RANDOM_ANIME_PARSE_RESPONSE: (body) => common_tags_1.stripIndents `
        Score: **${body.avg_score}**
        Episodes: **${body.episodes}**
        Duration: **${body.eps_duration}**
        Release: **${body.release_date}**
        Season: **${body.season}**
        Rating: **${body.rating}**
        Source: **${body.source}**
        Genres: ${body.genres.map(x => `\`${x}\``).join(", ")}
    `,
    COMMAND_RANDOM_ANIME_PARSE_WATCH: () => "Watch",
    COMMAND_SHIP_DESCRIPTION: () => "ship two user ❤️",
    COMMAND_SHIP_PROMPT: () => "Which user do you want to ship it?",
    COMMAND_GAME_VERIFY_WAIT: (user) => `❓ **| ${user}, Do you want accept this challenge ?**`,
    COMMAND_GAME_VERIFY_NOT_ACCEPT: (user, offerWithClient = false) => `🍃 **| Look like ${user} doesn't accept your challenge.${offerWithClient ? " Do you want to play it with me anyway ?" : ""}**`,
    COMMAND_GAME_VERIFY_DECLINE_OFFER: () => "✋ **| Ok see you next time**",
    COMMAND_GAME_AWAIT_PLAYER_LIST: () => "👥 Player List",
    COMMAND_GAME_AWAIT_PLAYER_LASTS: () => "ℹ️ Players selection lasts 30 seconds",
    COMMAND_GAME_REACT_THIS_TO_JOIN: () => "react this to join",
    COMMAND_GAME_REACT_THIS_TO_INCLUDE_ME: () => "react this to include me",
    COMMAND_GAME_REACT_THIS_TO_CANCEL: () => "react this to cancel",
    COMMAND_GAME_REACT_THIS_TO_START: () => "react this to start",
    COMMAND_GAME_LIST_PREPARING: () => "🖌️ **| Preparing...**",
    COMMAND_GAME_LIST_TURN: (user) => `${user}, Turn!`,
    COMMAND_GAME_LIST_CONGRATS: (user) => `🎉 **| Congrats ${user} you won the match!**`,
    COMMAND_GAME_LIST_DRAW: () => "🇴 **| Draw!**",
    COMMAND_GAME_LIST_TIMEOUT: () => "⏱️ **| Timeout**",
    COMMAND_GAME_LIST_WRONG: (value) => `❌ **| Too Bad it was \`${value}\`**`,
    COMMAND_GAME_LIST_RIGHT: (value) => `✅ **| You're right! it was \`${value}\`**`,
    COMMAND_GAME_LIST_DESCRIPTION: () => "See the list of mini game i had",
    COMMAND_GAME_LIST_NOT_FOUND: () => "Mini game not found",
    COMMAND_GAME_LIST_ONLY_ONE: () => "❕ **| Only one game per channel**",
    COMMAND_GAME_LIST_INFO: (prefix) => `To play a game type '${prefix}game <game cmd>'`,
    COMMAND_GAME_CONNECT4_DESCRIPTION: () => "Play Connect4 game with other user. This is solved game, you must drop 4 marks horizontal vertical or diagonal to win the match.",
    COMMAND_GAME_GUESS_THE_NUMBER_DESCRIPTION: () => "Play Guess the Number Game!. This game is game of luck, i'll pick random number and you must guess it.",
    COMMAND_GAME_GUESS_THE_NUMBER_START: () => "❓ **| Guess the number started. you can guessing now!**",
    COMMAND_GAME_GUESS_THE_NUMBER_HIGHER: (num) => `🔼 **| The number is higher than \`${num}\`**`,
    COMMAND_GAME_GUESS_THE_NUMBER_SHORTER: (num) => `🔽 **| The number is shorter than \`${num}\`**`,
    COMMAND_GANE_HANGMAN_DESCRIPTION: () => "Save hanged man by guessing the word!. I'll hang random man and if you to want to safe him, just guess the word",
    COMMAND_GAME_MINESWEEPER_DESCRIPTION: () => "Your luck will be tested here. Its just a simple game, clear the lane without dough a bomb.",
    COMMAND_GAME_MINESWEEPER_DOUGH_BOMB: () => "❌ **| Lose, you dough a bomb**",
    COMMAND_GAME_MINESWEEPER_WIN: () => "🎉 **| Congrats, you clear lane without dough a bomb!**",
    COMMAND_GAME_TICTACTOE_DESCRIPTION: () => "Play Tic Tac Toe game with other user. This is solved game, you must placing 3 marks horizontal vertical or diagonal to win the match.",
    COMMAND_GAME_TRIVIA_DESCRIPTION: () => "Test your knowledge with random question!. Ill give you some random questions and you must answer it.",
    COMMAND_GAME_WORD_CHAIN_DESCRIPTION: () => "This game is able to train your vocabulary, by making a word from the last letter of the previous word",
    COMMAND_ABOUT_DESCRIPTION: () => "About me.",
    COMMAND_ABOUT_ABOUTME: (user, client, commands, prefix) => common_tags_1.stripIndents `
        👋 | Hi there, ${user}! I’m **${client.user.tag}** and I’m beyond happy and  glad to meet you! 
        I’m just an ordinary bot whose job is to make your Discord Server more fun and exciting
        for members to chat on. I do what other bots do as well, like: sending random images of animals, 
        generating games for this server’s members, and most importantly, I play and queue song requests. 
        To conclude, I carry \`${commands.filter(x => user.isDev || !x.option.devOnly).size}\` commands in total. To test me out, 
        why not start by generating my help panel? **${prefix}help**.
    `,
    COMMAND_HELP_DESCRIPTION: () => "The first command you'll typing",
    COMMAND_HELP_PARSE_DESC: (usage, aliases, cooldown) => common_tags_1.stripIndents `
        **Usage:** \`${usage}\`
        **Aliases:** ${aliases.map(x => `\`${x}\``)}
        **Cooldown:** \`${cooldown} seconds\`
    `,
    COMMAND_HELP_PARSE_EXAMPLES: () => "Examples",
    COMMAND_HELP_INFO_ARGS: () => "ℹ️ Don't include <> or []. <> means required, and [] means optional.",
    COMMAND_HELP_INFO_EXPLAIN: (prefix) => `ℹ️ To learn more about a specific command, do ${prefix}help <command name>`,
    COMMAND_INVITE_DESCRIPTION: () => "Invite the bot to your server",
    COMMAND_INVITE_CLICK_HRER: (inviteUrl) => `[Click here](${inviteUrl}) to invite me to your server!`,
    COMMAND_SAY_DESCRIPTION: () => "Let me repeat what you want",
    COMMAND_SAY_PROMPT: () => "What text do you want me to repeaat ?",
    COMMAND_STATS_DESCRIPTION: () => "Show my current statistic",
    COMMAND_MUSIC_PLAYING: (song) => `🎶 **Now Playing:** __**${song}**__`,
    COMMAND_MUSIC_GET_EXCEPTION: (stack) => `❌ **| Im getting exception while playing this song** ${stack}`,
    COMMAND_MUSIC_NOT_PLAY: () => "💤 **| Not Playing anything right now**",
    COMMAND_MUSIC_NOT_SAME_VC: (vc) => `❌ **| You must in ${vc}**`,
    COMMAND_MUISC_MEMBER_NOT_VC: () => "❌ **| Please Join Voice channel first**",
    COMMAND_MUSIC_LACK_PERM_CONNECT_OR_SPEAK: () => "❌ **| I Don't have permissions \`CONNECT\` or \`SPEAK\`**",
    COMMAND_MUSIC_VC_NOT_JOINABLE: () => "❌ **| Voice channel isn't joinable**",
    COMMAND_MUSIC_CANT_PLAY_CAUSE_STREAM: () => "❌ **| You can't do this! because Music Player currently in stream mode.**",
    COMMAND_MUISC_LOOP_DESCRIPTION: () => "Loop current queue",
    COMMAND_MUSIC_LOOP_ON: () => "🔁 **| Looping current queue**",
    COMMAND_MUISC_LOOP_OFF: () => "🔁 **| Disabled**",
    COMMAND_MUSIC_LYRICS_DESCRIPTION: () => "Get lyrics from query based",
    COMMAND_MUSIC_NP_DESCRIPTION: () => "What song is playing right now ?",
    COMMAND_MUSIC_NP_MOE_PARSE: (data) => common_tags_1.stripIndents `
        Artist(s): **${data.artists}**
        Album(s): **${data.albums || "None"}**
        Listener(s): **${data.listeners}**
        Source: **${data.source || "None"}**
        Requester: **${data.requester || "None"}** ${data.event ? `\`${data.event.name}\`` : ""}
    `,
    COMMAND_MUSIC_PAUSE_DESCRIPTION: () => "Pause or resume current song",
    COMMAND_MUSIC_PAUSE_ON: () => "⏸️ **| Paused**",
    COMMAND_MUSIC_PAUSE_OFF: () => "▶️ **| Resumed**",
    COMMAND_MUSIC_PLAY_DESCRIPTION: () => "Play some songs",
    COMMAND_MUSIC_PLAY_PROMPT: () => "What song do you wany to play ?",
    COMMAND_MUSIC_PLAY_ADD_PLAYLIST: (name) => `✅ **| Succes Added Playlist:** __**${name}**__`,
    COMMAND_MUSIC_PLAY_ADD_SONG: (name) => `✅ **| Added to queue:** __**${name}**__`,
    COMMAND_MUSIC_PLAY_SONG_SELECTION: () => "Songs Selection",
    COMMAND_MUSIC_PLAYMOE_DESCRIPTION: () => "Play radio from listen.moe",
    COMMAND_MUSIC_PLAYMOE_PROMPT: () => "Which radio culture do you want to select, `jpop` or `kpop` ?",
    COMMAND_MUSIC_PLAYMOE_INVALID_TYPE: () => "**Only `jpop` or `kpop` allowed!**",
    COMMAND_MUSIC_PLAYMOE_INHIBIT: () => "❌ **| You can't do this!. Because Music Player is in use**",
    COMMAND_MUSIC_QUEUE_DESCRIPTION: () => "Show the list of song that will play",
    COMMAND_MUSIC_REPEAT_DESCRIPTION: () => "repeat current queue",
    COMMAND_MUSIC_REPEAT_ON: () => "🔁 **| repeating current song.**",
    COMMAND_MUSIC_REPEAT_OFF: () => "🔁 **| Disabled.**",
    COMMAND_MUSIC_SEEK_DESCRIPTION: () => "Jump to position what you want",
    COMMAND_MUSIC_SEEK_PROMPT: () => "What time position do you want jump to ?",
    COMMAND_MUSIC_SEEK_NOT_SEEKABLE: () => "❌ **| This song isn't seekable**",
    COMMAND_MUSIC_SEEK_TOO_LONG_OR_SHORT: () => "❌ **| Time position is too long or short**",
    COMMAND_MUSIC_SEEK_SEEKED: (to) => `⏱️ **| Seeked to \`${to}\`**`,
    COMMAND_MUSIC_SHUFFLE_DESCRIPTION: () => "shuffle curent queue",
    COMMAND_MUSIC_SHUFFLE_SHUFFLED: () => "🔀 **| Queue shuffled**",
    COMMAND_MUSIC_SKIP_DESCRIPTION: () => "Stop playing current song",
    COMMAND_MUSIC_SKIP_ALREADY_VOTE: () => "❕ **| You already voted**",
    COMMAND_MUSIC_SKIP_NEED_MORE_VOTE: (now, needed) => `📢 **| You voted for skip this song, need more votes! **${now} / ${needed}**`,
    COMMAND_MUSIC_SKIP_SKIPPED: () => "⏭️ **| Skipped**",
    COMMAND_MUSIC_STOP_DESCRIPTION: () => "Clear all song in queue. and stop current song",
    COMMAND_MUSIC_STOP_STOPPED: () => "🛑 **| Stopped**",
    COMMAND_MUSIC_VOLUME_DESCRIPTION: () => "Stop playing current song",
    COMMAND_MUSIC_VOLUME_PROMPT: () => "How many volume do you want to change ?",
    COMMAND_MUSIC_VOLUME_TOO_HIGH: () => "**Volume is too high. max \`120\`**",
    COMMAND_MUSIC_VOLUME_TOO_LOW: () => "**Volume is too low. min \`0\`**",
    COMMAND_MUSIC_VOLUME_CHANGE: (to) => `🔉 **| Change Volume to \`${to}\`**`,
    COMMAND_UTIL_NO_RESULT_FOUND: () => "🚫 **| No result found.**",
    COMMAND_UTIL_TRIM_ARRAY_PATTERN: () => "...$len more.",
    COMMAND_NPM_DESCRIPTION: () => "See node package on npmjs.com",
    COMMAND_NPM_PROMPT: () => "What query do you want to search ?",
    COMMAND_NPM_UNKNOWN: () => "Unknown",
    COMMAND_NPM_NO_DEPENDENCIES: () => "**No Dependencies**",
    COMMAND_NPM_NO_DESC: () => "No Description",
    COMMAND_NPM_PARSE: (desc) => common_tags_1.stripIndents `
        > ${desc[0]}
        Version: **${desc[1]}**
        License: **${desc[2]}**
        Author: **${desc[3]}**
        Modified: **${desc[4]}**
        Dependencies: ${desc[5]}
        Maitainers: ${desc[6]}

        [Download](${desc[7]})
    `,
    COMMAND_BRAINLY_DESCRIPTION: () => "Search question from brainly.com",
    COMMAND_BRAINLY_PROMPT: () => "What question dou you want to search ?",
    COMMAND_BRAINLY_INVALID_REGION: (regions) => `**Unsupported Region!, supported: ${regions.map(x => `\`${x}\``).join(", ")}**`,
    COMMAND_BRAINLY_ATTACHMENT: () => "Attachments",
    COMMAND_BRAINLY_QUESTION: () => "QUESTION",
    COMMAND_BRAINLY_ANSWER: (best) => best ? "BEST ANSWER" : "ANSWER",
    COMMAND_MDN_DESCRIPTION: () => "Lookup JavaScript reference from developer.mozilla.org",
    COMMAND_MDN_PROMPT: () => "Which Javascript reference do you want to see ?"
};
