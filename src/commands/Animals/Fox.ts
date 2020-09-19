import type YumekoClient from "@yumeko/classes/Client";
import BunnyCommand from "@yumeko/commands/Animals/Bunny";
import request from "node-superfetch";
import { constantly } from "@yumeko/decorators";

export default class extends BunnyCommand {
    public constructor(client: YumekoClient) {
        super(client, "fox");
    }

    @constantly
    public async getImage(): Promise<string> {
        const { body }: any = await request.get("https://randomfox.ca/floof/");
        return body.image;
    }
}