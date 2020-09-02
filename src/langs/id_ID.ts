import en_US from "@yumeko/langs/en_US";
import { stripIndents } from "common-tags";

enum Animals {
    burung, kelinci, kucing,
    anjing, bebek, serigala,
    kangguru, koala, kadal,
    "burung hantu", panda, rakun,
    "anjing shiba"
}

export default {
    // Adding default value
    ...en_US,

    // META
    META_NAME: () => "Indonesia (ID)",
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
    // ADMIN
    COMMAND_LANGUAGE_DESCRIPTION: () => "Mengatur bahasa ku",
    COMMAND_LANGUAGE_NOT_FOUND: key => `**Bahasa dengan kata kunci \`${key}\` tidak ditemukan**`,
    COMMAND_LANGUAGE_SET: (to, toEmote) => `${toEmote} **| Bahasa diatur ke \`${to}\`**`,
    COMMAND_LANGUAGE_LIST: (prefix, list, current, currentEmote) => stripIndents`
        ${currentEmote} **| Bahasa sekarang \`${current}\`**

        __**Daftar Bahasa**__
        ${list}

        *Untuk mengubah bahasa gunakan \`${prefix}language <id | lang>\`*
    `,

    COMMAND_PREFIX_DESCRIPTION: () => "Mengatur prefix guild",
    COMMAND_PREFIX_CURRENT: prefix => `❗ **| Prefix ku saat ini adalah \`${prefix}\`**`,
    COMMAND_PREFIX_SET_TO: prefix => `❗ **| Prefix di set ke \`${prefix}\`**`,

    // ANIMAL
    COMMAND_ANIMAL_DESCRIPTION: id => `Menampilkan gambar ${Animals[id]} secara acak.`,
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

    COMMAND_GAME_AWAIT_PLAYER_LIST: () => "👥 Daftar Pemain",
    COMMAND_GAME_AWAIT_PLAYER_LASTS: () => "ℹ️ Pemilihan pemain berlangsung selama 30 detik",
    COMMAND_GAME_REACT_THIS_TO_JOIN: () => "react ini untuk bergabung",
    COMMAND_GAME_REACT_THIS_TO_INCLUDE_ME: () => "react ini untuk membuat diriku bergabung",
    COMMAND_GAME_REACT_THIS_TO_CANCEL: () => "react ini untuk membatalkan",
    COMMAND_GAME_REACT_THIS_TO_START: () => "react ini untuk memulai",

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

    COMMAND_GAME_CONNECT4_DESCRIPTION: () => "Mainkan Connect4 game dengan user lain. Ini adalah permainan yang mengacu pada keakuratan, kamu harus menjatuhkan 4 tanda baik itu horizontal, vertical ataupun diagonal untuk memenangkan pertandingan.",

    COMMAND_GAME_GUESS_THE_NUMBER_DESCRIPTION: () =>  "Mainkan Guess the Number Game!. Game ini adalah game yang mengacu kepada keberuntungan, aku akan memilih nomor secara acak dan kamu harus menebaknya.",
    COMMAND_GAME_GUESS_THE_NUMBER_START: () => "❓ **| Guess the Number telah diumalai. kamu bisa menebak sekarang!**",
    COMMAND_GAME_GUESS_THE_NUMBER_HIGHER: num => `🔼 **| Nomornya lebih besar dari \`${num}\`**`,
    COMMAND_GAME_GUESS_THE_NUMBER_SHORTER: num => `🔽 **| Nomornya lebih kecil dari \`${num}\`**`,

    COMMAND_GANE_HANGMAN_DESCRIPTION: () => "Selamatkan orang yang digantung dengan menebak kata!. Aku akan menggantung seseorang dan jika kamu ingin menyelamatkannya, maka kamu hanya perlu menebak kata yang ku berikan.",

    COMMAND_GAME_MINESWEEPER_DESCRIPTION: () => "Keberuntungan mu di test disini. Hanya simple game, bersihkan semua tanpa menggali sebuah bomb.",
    COMMAND_GAME_MINESWEEPER_DOUGH_BOMB: () => "❌ **| Kalah, kamu telah menggali sebuah bomb!**",
    COMMAND_GAME_MINESWEEPER_WIN: () => "🎉 **| Selamat, kamu membersihkan semuanya tanpa menggali sebuah bomv!**",

    COMMAND_GAME_TICTACTOE_DESCRIPTION: () => "Mainkan Tic Tac Toe game dengan user lainnya. Ini adalah game yang membutuhkan keakuratan, kamu mesti menaruh 3 tanda baik itu horizontal, vertical, maupun diagonal untuk memenangkan pertandingan.",

    COMMAND_GAME_TRIVIA_DESCRIPTION: () => "Mengetes pengetahuan mu dengan soal acak!. Aku akan memberinu soal secara acak dan kamu harus bisa menjawabnya.",

    COMMAND_GAME_WORD_CHAIN_DESCRIPTION: () => "Game ini mampu melatih kosa kata inggris mu, dengan membuat sebuah kata dari huruf terakhir kata sebelumnya.",

    // GENERAL
    COMMAND_ABOUT_DESCRIPTION: () => "Tentang aku.",
    COMMAND_ABOUT_ABOUTME: (user, client, commands, prefix) => stripIndents`
        👋 | Hai, ${user}! Aku **${client.user!.tag}** dan aku senang bertemu dengan mu! 
        Aku hanyalah bot biasa yang dapat memberi kecerian dan kesanangan pada server mu.
        Aku dapat melakukan yang bot lain lakukan, misalnya: musik, mengirim gamber, dan lain lain.
        Aku membawa \`${commands.filter(x => user.isDev || !x.option.devOnly).size}\` command untuk kau mainkan.
        Untuk mengechecknya ayo mulai dengan mengetik **${prefix}help**.
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

    COMMAND_STATS_DESCRIPTION: () => "Memperlihatkan statistik ku",

    // Music
    COMMAND_MUSIC_PLAYING: song => `🎶 **Sekarang memainkan:** __**${song}**__`,
    COMMAND_MUSIC_GET_EXCEPTION: stack => `❌ **| Aku mendapat exception saat memutar lagu ini** ${stack}`,
    COMMAND_MUSIC_NOT_PLAY: () => "💤 **| Tidak memutar lagu apapun sekarang**",
    COMMAND_MUSIC_NOT_SAME_VC: vc => `❌ **| Kamu harus berada di ${vc}**`,
    COMMAND_MUISC_MEMBER_NOT_VC: () => "❌ **| Kamu harus berada dalam voice channel!**",
    COMMAND_MUSIC_LACK_PERM_CONNECT_OR_SPEAK: () => "❌ **| Aku tidak mempunyai permissions \`CONNECT\` atau \`SPEAK\`**",
    COMMAND_MUSIC_VC_NOT_JOINABLE: () => "❌ **| Voice channel terlalu penuh**",
    COMMAND_MUSIC_CANT_PLAY_CAUSE_STREAM: () => "❌ **| Kamu tidak bisa melakukannya saat stream berlangsung.**",

    COMMAND_MUISC_LOOP_DESCRIPTION: () => "Mengulang antrian yang yang diputar",
    COMMAND_MUSIC_LOOP_ON: () => "🔁 **| Antrian sekarang akan diulang**",
    COMMAND_MUISC_LOOP_OFF: () => "🔁 **| Dimatikan**",

    COMMAND_MUSIC_LYRICS_DESCRIPTION: () => "Mendapat lyrics sebuah lagu",

    COMMAND_MUSIC_NP_DESCRIPTION: () => "Lagu apa yang dimainkan sekarag?",
    COMMAND_MUSIC_NP_MOE_PARSE: data => stripIndents`
        Seniman: **${data.artists}**
        Album: **${data.albums || "Tidak ada"}**
        Didengarkan: **${data.listeners} orang**
        Sumber: **${data.source || "Tidak asa"}**
        Request dari: **${data.requester || "Tidak ada"}** ${data.event ? `\`${data.event.name}\`` : ""}
    `,

    COMMAND_MUSIC_PAUSE_DESCRIPTION: () => "Menjeda atau melanjutkan lagu",
    COMMAND_MUSIC_PAUSE_ON: () => "⏸️ **| Terjeda**",
    COMMAND_MUSIC_PAUSE_OFF: () => "▶️ **| Dilanjutkan**",

    COMMAND_MUSIC_PLAY_DESCRIPTION: () => "Putar beberapa lagu",
    COMMAND_MUSIC_PLAY_PROMPT: () => "Lagu apa yang ingin kamu putar ?",
    COMMAND_MUSIC_PLAY_ADD_PLAYLIST: name => `✅ **| Sukses menambahkan Playlist:** __**${name}**__`,
    COMMAND_MUSIC_PLAY_ADD_SONG: name => `✅ **| Antrian telah ditambahkan oleh lagu:** __**${name}**__`,
    COMMAND_MUSIC_PLAY_SONG_SELECTION: () => "Plihlah Lagu yang kamu ingin mainkan",

    COMMAND_MUSIC_PLAYMOE_DESCRIPTION: () => "Putar radio dari listen.moe",
    COMMAND_MUSIC_PLAYMOE_PROMPT: () => "Type radio apa yang kamu ingin putar, `jpop` atau `kpop` ?",
    COMMAND_MUSIC_PLAYMOE_INVALID_TYPE: () => "**Hanya `jpop` atau `kpop` yang dibolehkan!**",
    COMMAND_MUSIC_PLAYMOE_INHIBIT: () => "❌ **| Kamu tidak bisa melakukan ini, karena Music Player sedang dipakai**",

    COMMAND_MUSIC_QUEUE_DESCRIPTION: () => "Menampilkan antrian lagu yang akan diputar",

    COMMAND_MUSIC_REPEAT_DESCRIPTION: () => "Mengulang lagu yang sedang diputar",
    COMMAND_MUSIC_REPEAT_ON: () => "🔁 **| Lagu yang dimainkan sekarang akan terus diputar.**",
    COMMAND_MUSIC_REPEAT_OFF: () => "🔁 **| Dimatikan.**",

    COMMAND_MUSIC_SEEK_DESCRIPTION: () => "Lompat ke posisi lagu yang kamu inginkan",
    COMMAND_MUSIC_SEEK_PROMPT: () => "Posisi mana yang ingin kamu lompati ?",
    COMMAND_MUSIC_SEEK_NOT_SEEKABLE: () => "❌ **| Lagu ini tidak bisa dilompati**",
    COMMAND_MUSIC_SEEK_TOO_LONG_OR_SHORT: () => "❌ **| Posisi terlalu panjang atau pendek**",
    COMMAND_MUSIC_SEEK_SEEKED: to => `⏱️ **| Melompat ke \`${to}\`**`,

    COMMAND_MUSIC_SHUFFLE_DESCRIPTION: () => "Acak antrian lagu",
    COMMAND_MUSIC_SHUFFLE_SHUFFLED: () => "🔀 **| Antrian. telah diacak**",

    COMMAND_MUSIC_SKIP_DESCRIPTION: () => "Melewati lagu yang sedang dimainkan",
    COMMAND_MUSIC_SKIP_ALREADY_VOTE: () => "❕ **| Kamu sudah memberi vote**",
    COMMAND_MUSIC_SKIP_NEED_MORE_VOTE: (now, needed) => `📢 **| Kamu telah mmeberi vote untuk melewati lagu ini. Butuh lebih banyak vote! **${now} / ${needed}**`,
    COMMAND_MUSIC_SKIP_SKIPPED: () => "⏭️ **| Lagu telah dilewati**",

    COMMAND_MUSIC_STOP_DESCRIPTION: () => "Memberhentikan antrian dan lagu yang dimainkan",
    COMMAND_MUSIC_STOP_STOPPED: () => "🛑 **| Antrian diberhentikan**",

    COMMAND_MUSIC_VOLUME_DESCRIPTION: () => "Mengubah volume music player",
    COMMAND_MUSIC_VOLUME_PROMPT: () => "Berapa banyak volume yang ingin kamu ubah ?",
    COMMAND_MUSIC_VOLUME_TOO_HIGH: () => "**Volume terlalu tinggi. maksimal \`120\`**",
    COMMAND_MUSIC_VOLUME_TOO_LOW: () => "**Volume terlalu rendah. minimal \`0\`**",
    COMMAND_MUSIC_VOLUME_CHANGE: to => `🔉 **| Mengubah Volume ke \`${to}\`**`,

    // UTIL
    COMMAND_UTIL_NO_RESULT_FOUND: () => "🚫 **| Hasil tidak ditemukan.**",
} as typeof en_US;