import type YumekoClient from "../../classes/Client";
import BunnyCommand from "./Bunny";
import request from "node-superfetch";

export default class CatCommand extends BunnyCommand {
    public constructor(client: YumekoClient) {
        super(client, "cat");
    }

    public async getImage(): Promise<string> {
        const { text } = await request.get("https://random.cat");
        return text.split("img src")[1].split("\"")[1];
    }
}