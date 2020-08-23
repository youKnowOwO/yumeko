import type YumekoClient from "@yumeko/classes/Client";
import BunnyCommand from "@yumeko/commands/Animals/Bunny";
import request from "node-superfetch";

export default class LizardCommand extends BunnyCommand {
    public constructor(client: YumekoClient) {
        super(client, "lizard");
    }

    public async getImage(): Promise<string> {
        const { body }: any = await request.get("https://nekos.life/api/v2/img/lizard");
        return body.url;
    }
}