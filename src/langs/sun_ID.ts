import id_ID from "@yumeko/langs/id_ID";
import { stripIndents } from "common-tags";

enum Animals {
    manuk, kelinci, ucing,
    anjing, entog, ajag,
    kangguru, koala, kadal,
    bueg, panda, rakun,
    "anjing shiba"
}

export default {
    // Adding default value
    ...id_ID,

    // META
    META_NAME: () => "Sunda (ID)",
    META_ID: () => "sun_ID",
    META_EMOJI: () => "🇮🇩",

    // COMMAND RUNNER
    COMMAND_RUNNER_ONLY_NSFW: () => "❌ **| Command iyeu ngan jalan di channel NSFW**",
    COMMAND_RUNNER_ONLY_ONE: user => `**❌ | ${user}, hideup teu bisa make command leuwih ti 1**`,
    COMMAND_RUNNER_IN_COOLDOWN: (user, amount) => `**⏱️ | ${user}, sabar!.** anjeun bisa make deui command dina \`${Math.round(amount)}\` detik`,
    COMMAND_RUNNER_MISSPERMS: (user, perm, isclient) => `**❌ | ${isclient ? "Abi" : `${user}, anjeun`} merlukeun permissions iyeu jang ngajalankeun command. ${perm}**`,
    COMMAND_RUNNER_ERROR: stack => `**🚫 | Jigana dev abi rada cape yeuh.** ${stack}`,

    // ARGUMENT PARSER
    ARGUMENT_PARSER_PROMPT: (sign, prompt) => stripIndents`
        **${sign} |** ${prompt}
        **▫️ |** *Hidep ngan boga \`30\` detik jang nentukeun*
        **▫️ | ** *Ketik \`cancel\` mun rek ngabatalkeun.*
        **▫️ | ** *Atawa mun rek nulis cancel pake \`|cancel|\`*
    `,
    ARGUMENT_PARSER_CANCELED: () => "👌 **| Dibatalkeun**",
    ARGUMENT_PARSER_NOT_UNDERSTAND: user => `**🤷 | ${user}, Sigana hidep kurang apal ngajalankeun command iyeu.**`,

    // TYPE
    TYPE_CODE_NOT_FOUND: () => "**Cing asupkeun codeblock. kawas:** ```kieu```",

    TYPE_COMMAND_HAS_SIMILIAR: (content, similiar) => `**\`${content}\` teu kateang.** ${similiar.length ? `Atawa salah sahiji ti ieu ? ${similiar}` : ""}`,

    TYPE_IMAGE_SIZE_EXCEDED: () => "**Bates ukuran file na `8MB`**",
    TYPE_IMAGE_UNSUPPORTED_EXT: () => "**Type file na teu kaharti. Conto file nu kaharti: `PNG`, `JPG`, `BMP`, `GIF`**`",

    TYPE_MEMBER_NOT_FOUND: () => "Member teu ka teang. Asupkeun kata kunci na nu bener!",
    TYPE_MEMBER_HAS_SIMILIAR: memberlist => `Cing sing spesifik ngasupkeun kata kunci teh!. kawas: ${memberlist}`,

    TYPE_HUMAN_BOT: () => "**Bot mah ulah!**",
    TYPE_HUMAN_SELF: () => "**Teu bisa milih diri sorangan**",

    TYPE_NUMBER_NOT_FOUND: content => `**\`${content}\` lain nomor**`,

    TYPE_TIMESPAN_NOT_FOUND: () => "**Posisi teu kaharti**",

    TYPE_URL_NOT_FOUND: () => "**URL teu kaharti!**",

    // COMMAND
    // ADMIN
    COMMAND_LANGUAGE_DESCRIPTION: () => "Ngatur bahasa abi",
    COMMAND_LANGUAGE_NOT_FOUND: key => `**Bahasa dengan kata kunci \`${key}\` teh, teu kateang**`,
    COMMAND_LANGUAGE_SET: (to, toEmote) => `${toEmote} **| Bahasa diatur ka \`${to}\`**`,
    COMMAND_LANGUAGE_LIST: (prefix, list, current, currentEmote) => stripIndents`
        ${currentEmote} **| Bahasa ayeuna \`${current}\`**

        __**Daftar Bahasa**__
        ${list}

        *Mun rek ngubah bahasa gunakeun \`${prefix}language <id | lang>\`*
    `,

    // ANIMAL
    COMMAND_ANIMAL_DESCRIPTION: id => `Nampilkeun gambar ${Animals[id]} sacara acak.`,
    COMMAND_ANIMAL_CLICK_HERE: () => "Klik didieu mun gambar teu katenjo",

    // FUN
    COMMAND_FUN_PAINTING: () => "🖌️ **| Ngagambar...**",

    COMMAND_8BALL_DESCRIPTION: () => "Nanyakeun pertanyaan ka 8Ball",
    COMMAND_8BALL_PROMPT: () => "Naon pertanyaan hidep nu rek ditanyakeun ?",

    COMMAND_BANANA_DESCRIPTION: () => "Ningali panjangna cau salah sahiji user",
    COMMAND_BANANA_LENGTH: (member, length) => `🍌 **| \`${member.displayName}\` boga panjang cau \`${length}cm\`**`,

    COMMAND_CHUCKNORRIS_DESCRIPTION: () => "Hehereuyan Chuck Norris.",

    COMMAND_DADJOKE_DESCRIPTION: () => "Heheureuyan Dad Joke",

    COMMAND_FORTUNE_COOKIE_DESCRIPTION: () => "Buka kue na jeung tingali untungna.",

    COMMAND_RANDOM_ANIME_DESCRIPTION: () => "Ngadapetkeun info anime sacara acak",
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

    COMMAND_SHIP_DESCRIPTION: () => "Jodohkeun anatara 2 user ❤️",
    COMMAND_SHIP_PROMPT: () =>  "Saha user nu rek dijodohkeun?",

    COMMAND_GAME_VERIFY_WAIT: user => `❓ **| ${user}, Bener yeuh rek narima tantangan iyeu ?**`,
    COMMAND_GAME_VERIFY_NOT_ACCEPT: (user, offerWithClient = false) => `🍃 **| Jigana ${user} teu natima tantangan anjeun.${offerWithClient ? " Erek maen jeung abi ?" : ""}**`,
    COMMAND_GAME_VERIFY_DECLINE_OFFER: () => "✋ **| Heug dah.**",

    COMMAND_GAME_LIST_PREPARING: () => "🖌️ **| Mirunkeun...**",
    COMMAND_GAME_LIST_TURN: user => `${user}, iyeu giliran anjeun!`,
    COMMAND_GAME_LIST_CONGRATS: user => `🎉 **| Selamat ${user} anjeun menangkeun pertandingan!**`,
    COMMAND_GAME_LIST_DRAW: () => "🇴 **| Seri!**",
    COMMAND_GAME_LIST_TIMEOUT: () => "⏱️ **| Waktu na beak!**",
    COMMAND_GAME_LIST_WRONG: value => `❌ **| Hadeuh eta teh \`${value}\`**`,
    COMMAND_GAME_LIST_RIGHT: value => `✅ **| Hidep bener eta teh \`${value}\`**`,

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
} as typeof id_ID;