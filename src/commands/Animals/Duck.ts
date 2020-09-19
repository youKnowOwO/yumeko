import type YumekoClient from "@yumeko/classes/Client";
import BunnyCommand from "@yumeko/commands/Animals/Bunny";
import request from "node-superfetch";
import { constantly } from "@yumeko/decorators";

export default class extends BunnyCommand {
    public constructor(client: YumekoClient) {
        super(client, "duck");
    }

    @constantly
    public async getImage(): Promise<string> {
        const { body }: any = await request.get("https://random-d.uk/api/v1/random?type=gif");
        return body.url;
    }
}