import type YumekoClient from "@yumeko/classes/Client";
import BunnyCommand from "@yumeko/commands/Animals/Bunny";
import request from "node-superfetch";

export default class OwlCommand extends BunnyCommand {
    public constructor(client: YumekoClient) {
        super(client, "owl");
    }

    public async getImage(): Promise<string> {
        const { body }: any = await request.get("http://pics.floofybot.moe/owl");
        return body.image;
    }
}