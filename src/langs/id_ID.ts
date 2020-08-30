import en_US from "@yumeko/langs/en_US";

export default {
    ...en_US,
    META_NAME: () => "Indonesia",
    META_ID: () => "id_ID",
    COMMAND_RUNNER_ONLY_NSFW: () => "❌ **| Command ini hanya akan work dalam channel NSFW**",
    COMMAND_RUNNER_ONLY_ONE: user => `**❌ | ${user}, kamu tidak bisa menggunakan command lebih dari 1**`,
    COMMAND_RUNNER_IN_COOLDOWN: (user, amount) => `**⏱️ | ${user}, sabar!.** kamu bisa menggunakan command lagi dalam \`${Math.round(amount)}\` detik`,
    COMMAND_RUNNER_MISSPERMS: (user, perm, isclient) => `**❌ | ${isclient ? "Aku" : `${user}, kamu`} membutuhkan permission ini untuk menjalankan command. ${perm}**`
} as typeof en_US;