import en_US from "@yumeko/langs/en_US";
import { stripIndents } from "common-tags";

export default {
    // Adding default value
    ...en_US,

    // META
    META_NAME: () => "Indonesia",
    META_ID: () => "id_ID",

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
    ARGUMENT_PARSER_CANCELED: (): string => "👌 **| Dibatalkan**",
    ARGUMENT_PARSER_NOT_UNDERSTAND: (user) => `**🤷 | ${user}, sepertinya kamu tidak terlalu tahu menjalankan command ini.**`
} as typeof en_US;