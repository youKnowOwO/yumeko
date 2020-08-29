"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.getRule = exports.lint = void 0;
const eslint_1 = require("eslint");
const common_tags_1 = require("common-tags");
const linter = new eslint_1.Linter();
const rules = linter.getRules();
function lint(content, ecmaVersion, rules) {
    if (/\bawait\b/i.test(content))
        content = common_tags_1.stripIndents `
        (async function () {
            ${content}
        })()
    `;
    const errors = linter.verify(content, {
        extends: "eslint:recommended",
        parserOptions: {
            ecmaVersion,
            sourceType: "module"
        },
        env: {
            es6: true,
            node: true
        },
        rules
    });
    return errors;
}
exports.lint = lint;
function getRule(query) {
    return rules.get(query);
}
exports.getRule = getRule;
function handle(msg) {
    if (msg.author.bot || !msg.guild ||
        !msg.guild.available || !msg.guild.me.hasPermission(["ADD_REACTIONS", "SEND_MESSAGES", "EMBED_LINKS"]))
        return Promise.resolve(false);
    const { collector } = msg.client;
    if (collector.runner.getPrefix(msg))
        return Promise.resolve(false);
    const typeCode = collector.runner.argsParser.getType("code");
    try {
        const script = typeCode(msg, msg.content);
        if (!script.lang)
            throw new Error();
        if (!["js", "javascript", "json"].includes(script.lang.toLowerCase()))
            throw new Error();
        return collector.commands.get("lint").handleReact(msg, script);
    }
    catch {
        return Promise.resolve(false);
    }
}
exports.handle = handle;
