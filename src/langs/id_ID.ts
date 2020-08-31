import en_US from "@yumeko/langs/en_US";
import { stripIndents } from "common-tags";

export default {
    // Adding default value
    ...en_US,

    // META
    META_NAME: () => "Indonesia",
    META_ID: () => "id_ID",
    META_EMOJI: () => "🇮🇩",

    // COMMAND RUNNER
    COMMAND_RUNNER_ONLY_NSFW: () => "❌ **| Command ini hanya akan work dalam channel NSFW**",
    COMMAND_RUNNER_ONLY_ONE: user => `**❌ | ${user}, kamu tidak bisa menggunakan command lebih dari 1**`,
    COMMAND_RUNNER_IN_COOLDOWN: (user, amount) => `**⏱️ | ${user}, sabar!.** kamu bisa menggunakan command lagi dalam \`${Math.round(amount)}\` detik`,
    COMMAND_RUNNER_MISSPERMS: (user, perm, isclient) => `**❌ | ${isclient ? "Aku" : `${user}, kamu`} membutuhkan permission ini untuk menjalankan command. ${perm}**`,
    COMMAND_RUNNER_ERROR: stack => `**🚫 | Maap dev ku agak capek sepertinya.** ${stack}`,

    // ARGUMENT PARSER
    ARGUMENT_PARSER_PROMPT: (sign, prompt) => stripIndents`
        **${sign} |** ${prompt}
        **▫️ |** *Kamu mempunyai \`30\` detik untuk menentukan*
        **▫️ | ** *Ketik \`cancel\` untuk membatalkan.*
        **▫️ | ** *Atau jika kamu ingin menulis cancel gunakan \`|cancel|\`*
    `,
    ARGUMENT_PARSER_CANCELED: () => "👌 **| Dibatalkan**",
    ARGUMENT_PARSER_NOT_UNDERSTAND: user => `**🤷 | ${user}, sepertinya kamu tidak terlalu tahu menjalankan command ini.**`,

    // TYPE
    TYPE_CODE_NOT_FOUND: () => "**Tolong masukan codeblock. seperti:** ```ini```",

    TYPE_COMMAND_HAS_SIMILIAR: (content, similiar) => `**\`${content}\` tidak ada.** ${similiar.length ? `Apakah salah satu dari ini ? ${similiar}` : ""}`,

    TYPE_IMAGE_SIZE_EXCEDED: () => "**Maksimum ukuran file adalah `8MB`**",
    TYPE_IMAGE_UNSUPPORTED_EXT: () => "**File type tidak didukung. Contoh type yang didikung: `PNG`, `JPG`, `BMP`, `GIF`**`",

    TYPE_MEMBER_NOT_FOUND: () => "Member tidak ditemukan. Masukan kata kunci yang benar!",
    TYPE_MEMBER_HAS_SIMILIAR: memberlist => `Tolong lebih spesifik dalam memberikan kata kunci. seperti: ${memberlist}`,

    TYPE_HUMAN_BOT: () => "**Bot tidak diizinkan!**",
    TYPE_HUMAN_SELF: () => "**Kamu tidak bisa memilih dirimu sendiri**",

    TYPE_NUMBER_NOT_FOUND: content => `**\`${content}\` bukanlah sebuah nomor**`,

    TYPE_TIMESPAN_NOT_FOUND: () => "**Tidak bisa menentukan posisi**",

    TYPE_URL_NOT_FOUND: () => "**URL tidak valid!**",

    // COMMAND
    // ANIMAL
    COMMAND_ANIMAL_CLICK_HERE: () => "Klik disini jika gambar tidak muncul",

    // FUN
    COMMAND_FUN_PAINTING: () => "🖌️ **| Menggambar...**",

    COMMAND_8BALL_DESCRIPTION: () => "Bertanya kepada Magic 8Ball",
    COMMAND_8BALL_PROMPT: () => "Apa pertanyaan yang ingin kamu tanyakan ?",

    COMMAND_BANANA_DESCRIPTION: () => "Melihat panjang pisang sebuah user",
    COMMAND_BANANA_LENGTH: (member, length) => `🍌 **| \`${member.displayName}\` mempunyai panjang pisang \`${length}cm\`**`,

    COMMAND_CHUCKNORRIS_DESCRIPTION: () => "Candaan Chuck Norris secara acak.",

    COMMAND_DADJOKE_DESCRIPTION: () => "Dad joke secara acak",

    COMMAND_FORTUNE_COOKIE_DESCRIPTION: () => "Buka kue mu dan lihat keberuntungannya.",

    COMMAND_RANDOM_ANIME_DESCRIPTION: () => "Mendapat informasi anime secara acak",
    COMMAND_RANDOM_ANIME_PARSE_RESPONSE: body => stripIndents`
        Skor: **${body.avg_score}**
        Episode: **${body.episodes}**
        Durasi: **${body.eps_duration}**
        Rilis: **${body.release_date}**
        Season: **${body.season}**
        Rating: **${body.rating}**
        Sumber: **${body.source}**
        Genre: ${body.genres.map(x => `\`${x}\``).join(", ")}
    `,
    COMMAND_RANDOM_ANIME_PARSE_WATCH: () => "Tonton",

    COMMAND_SHIP_DESCRIPTION: () => "Jodohkan antara 2 user ❤️",
    COMMAND_SHIP_PROMPT: () =>  "Siapa user yang ingin kamu jodohkan?",

    COMMAND_GAME_VERIFY_WAIT: user => `❓ **| ${user}, Apakah kamu menerima tantangan ini ?**`,
    COMMAND_GAME_VERIFY_NOT_ACCEPT: (user, offerWithClient = false) => `🍃 **| Sepertinya ${user} tidak menerima tantangan mu.${offerWithClient ? " Apakah kamu ingin bermain bersama ku ?" : ""}**`,
    COMMAND_GAME_VERIFY_DECLINE_OFFER: () => "✋ **| Ok sampai jumpa kembali**",

    COMMAND_GAME_LIST_PREPARING: () => "🖌️ **| Mempersiapkan...**",
    COMMAND_GAME_LIST_TURN: user => `${user}, ini giliran mu!`,
    COMMAND_GAME_LIST_CONGRATS: user => `🎉 **| Selamat ${user} kamu memenangkan pertandingan!**`,
    COMMAND_GAME_LIST_DRAW: () => "🇴 **| Seri!**",
    COMMAND_GAME_LIST_TIMEOUT: () => "⏱️ **| Waktu Habis!**",
    COMMAND_GAME_LIST_WRONG: value => `❌ **| Sayang sekali itu adalah \`${value}\`**`,
    COMMAND_GAME_LIST_RIGHT: value => `✅ **| Kamu benar itu adalah \`${value}\`**`,

    COMMAND_GAME_LIST_DESCRIPTION: () => "Melihat beberapa mini game yang ku punya",
    COMMAND_GAME_LIST_NOT_FOUND: () => "Mini game tidak ditwmukan",
    COMMAND_GAME_LIST_ONLY_ONE: () => "❕ **| Setiap channel tidak boleh lebih dari 2 game**",
    COMMAND_GAME_LIST_INFO: prefix => `Untuk memainkan game ketik '${prefix}game <game cmd>'`,

    COMMAND_GAME_CONNECT4_DESCRIPTION: () => "Play Connect4 game with other user. This is solved game, you must drop 4 marks horizontal vertical or diagonal to win the match.",

    COMMAND_GAME_GUESS_THE_NUMBER_DESCRIPTION: () =>  "Play Guess the Number Game!. This game is game of luck, i'll pick random number and you must guess it.",
    COMMAND_GAME_GUESS_THE_NUMBER_START: () => "❓ **| Guess the Number telah diumalai. kamu bisa menebak sekarang!**",
    COMMAND_GAME_GUESS_THE_NUMBER_HIGHER: num => `🔼 **| Nomornya lebih besar dari \`${num}\`**`,
    COMMAND_GAME_GUESS_THE_NUMBER_SHORTER: num => `🔽 **| Nomornya lebih kecil dari \`${num}\`**`,

    COMMAND_GANE_HANGMAN_DESCRIPTION: () => "Save hanged man by guessing the word!. I'll hang random man and if you to want to safe him, just guess the word",

    COMMAND_GAME_MINESWEEPER_DESCRIPTION: () => "Your luck will be tested here. Its just a simple game, clear the lane without dough a bomb.",
    COMMAND_GAME_MINESWEEPER_DOUGH_BOMB: () => "❌ **| Kalah, kamu telah menggali sebuah bomb!**",
    COMMAND_GAME_MINESWEEPER_WIN: () => "🎉 **| Selamat, kamu membersihkan semuanya tanpa menggali sebuah bomv!**",

    COMMAND_GAME_TICTACTOE_DESCRIPTION: () => "Play Tic Tac Toe game with other user. This is solved game, you must placing 3 marks horizontal vertical or diagonal to win the match.",

    COMMAND_GAME_TRIVIA_DESCRIPTION: () => "Test your knowledge with random question!. Ill give you some random questions and you must answer it.",

    COMMAND_GAME_WORD_CHAIN_DESCRIPTION: () => "This game is able to train your vocabulary, by making a word from the last letter of the previous word",

    // GENERAL
    COMMAND_ABOUT_DESCRIPTION: () => "Tentang aku.",
    COMMAND_ABOUT_ABOUTME: (user, client, commands) => stripIndents`
        👋 | Hai, ${user}! Aku **${client.user!.tag}** dan aku senang bertemu dengan mu! 
        Aku hanyalah bot biasa yang dapat memberi kecerian dan kesanangan pada server mu.
        Aku dapat melakukan yang bot lain lakukan, misalnya: musik, mengirim gamber, dan lain lain.
        Aku membawa \`${commands.filter(x => user.isDev || !x.option.devOnly).size}\` command untuk kau mainkan.
        Untuk mengechecknya ayo mulai dengan mengetik **${client.config.prefix}help**.
    `,

    COMMAND_HELP_DESCRIPTION: () => "Command pertama yang mungkin kamu ketik",
    COMMAND_HELP_PARSE_DESC: (usage, aliases, cooldown) => stripIndents`
        **Cara Menggunakan:** \`${usage}\`
        **Alias:** ${aliases.map(x => `\`${x}\``)}
        **Cooldown:** \`${cooldown} detik\`
    `,
    COMMAND_HELP_PARSE_EXAMPLES: () => "Contoh",
    COMMAND_HELP_INFO_ARGS: () => "ℹ️ Jangan masukan <> atau []. <> berarti dibutuhkan, dan [] berarti boleh dimasukan ataupun tidak.",
    COMMAND_HELP_INFO_EXPLAIN: prefix  => `ℹ️ Untuk mengetahui lebih lanjut tentang sebuah command, ketik ${prefix}help <command name>`,

    COMMAND_INVITE_DESCRIPTION: () => "Invite bot ke server mu",
    COMMAND_INVITE_CLICK_HRER: inviteUrl => `[Klik disini](${inviteUrl}) untuk menginvite ku ke server mu!`,

    COMMAND_SAY_DESCRIPTION: () => "Mengucapkan kembali apa yang kamu ketik",
    COMMAND_SAY_PROMPT: () => "Ucapan seperti apa yang ingin aku ucapkan kembali?",

    COMMAND_STATS_DESCRIPTION: () => "Memperlihatkan statistik ku"
} as typeof en_US;