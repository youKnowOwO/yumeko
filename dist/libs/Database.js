"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongotrize_1 = require("@youKnowOwO/mongotrize");
const config = require("../../config.json");
class YumekoDatabase {
    constructor() {
        this.name = "yumeko";
        this.guild = this.createDatabase("guild", {
            prefix: config.prefix,
            lang: "en_US"
        });
    }
    get uri() {
        return process.env.DATABASE;
    }
    async connect() {
        await this.guild.connect();
    }
    createDatabase(collectionName, defaultValue, cache = false) {
        return new mongotrize_1.MongoMap({
            name: this.name,
            collectionName,
            uri: this.uri,
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true
            },
            cache
        }).ensure(defaultValue);
    }
}
exports.default = YumekoDatabase;
