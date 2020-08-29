"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class YumekoUser extends discord_js_1.Structures.get("User") {
    get isDev() {
        return this.client.config.owners.includes(this.id);
    }
}
discord_js_1.Structures.extend("User", () => YumekoUser);
