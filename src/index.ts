import { ShardingManager } from "discord.js";
import { join } from "path";

const config =  require("../config.json");

if (process.argv[2] === "dev") {
    require("./util/EnvLoader");
    config.debug = true;
}

const path = join(__dirname, "./yumeko.js");
const shards = new ShardingManager(path, {
    totalShards: process.argv[2] === "dev" ? 1 : config.shard
});
shards.spawn();