import { MongoMap } from "@youKnowOwO/mongotrize";
import { hide } from "@yumeko/decorators";

const config = require("../../config.json");

export default class YumekoDatabase {
    public readonly name = "yumeko";

    @hide
    public readonly uri = process.env.DATABASE!;

    public readonly guild = this.createDatabase("guild", {
        prefix: config.prefix as string,
        lang: "en_US"
    });

    public async connect(): Promise<void> {
        await this.guild.connect();
    }

    private createDatabase<V>(collectionName: string, defaultValue: V, cache = false): MongoMap<V> {
        return new MongoMap<V>({
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