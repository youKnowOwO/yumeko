import type YumekoClient from "@yumeko/classes/Client";
import BunnyCommand from "@yumeko/commands/Animals/Bunny";
import request from "node-superfetch";

export default class DuckCommand extends BunnyCommand {
    public constructor(client: YumekoClient) {
        super(client, "duck");
    }

    public async getImage(): Promise<string> {
        const { body }: any = await request.get("https://random-d.uk/api/v1/random?type=gif");
        return body.url;
    }
}