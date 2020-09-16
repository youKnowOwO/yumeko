"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongotrize_1 = require("@youKnowOwO/mongotrize");
const decorators_1 = require("@yumeko/decorators");
const config = require("../../config.json");
class YumekoDatabase {
    constructor() {
        this.name = "yumeko";
        this.uri = process.env.DATABASE;
        this.guild = this.createDatabase("guild", {
            prefix: config.prefix,
            lang: "en_US"
        });
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
__decorate([
    decorators_1.hide
], YumekoDatabase.prototype, "uri", void 0);
exports.default = YumekoDatabase;
