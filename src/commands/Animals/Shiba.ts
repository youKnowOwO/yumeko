import type YumekoClient from "../../classes/Client";
import BunnyCommand from "./Bunny";
import request from "node-superfetch";

export default class ShibaCommand extends BunnyCommand {
    public constructor(client: YumekoClient) {
        super(client, "shiba");
    }

    public async getImage(): Promise<string> {
        const { body }: any = await request.get("http://shibe.online/api/shibes");
        return body[0];
    }
}