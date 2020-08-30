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
    COMMAND_8BALL_DESCRIPTION: () => "Bertanya kepada Magic 8Ball",
    COMMAND_8BALL_PROMPT: () => "Apa pertanyaan yang ingin kamu tanyakan ?",

    COMMAND_BANANA_DESCRIPTION: () => "Melihat panjang pisang sebuah user",
    COMMAND_BANANA_LENGTH: (member, length) => `🍌 **| \`${member.displayName}\` mempunyai panjang pisang \`${length}cm\`**`,
} as typeof en_US;