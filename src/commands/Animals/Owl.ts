import type YumekoClient from "@yumeko/classes/Client";
import BunnyCommand from "@yumeko/commands/Animals/Bunny";
import request from "node-superfetch";
import { constantly } from "@yumeko/decorators";

export default class OwlCommand extends BunnyCommand {
    public constructor(client: YumekoClient) {
        super(client, "owl");
    }

    @constantly
    public async getImage(): Promise<string> {
        const { body }: any = await request.get("http://pics.floofybot.moe/owl");
        return body.image;
    }
}