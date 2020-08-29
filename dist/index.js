"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = require("path");
const config = require("../config.json");
const path = path_1.join(__dirname, "./yumeko.js");
const shards = new discord_js_1.ShardingManager(path, {
    totalShards: process.argv[2] === "dev" ? 1 : config.shard
});
shards.spawn();
