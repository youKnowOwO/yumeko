import type YumekoClient from "@yumeko/classes/Client";
import BunnyCommand from "@yumeko/commands/Animals/Bunny";
import request from "node-superfetch";

export default class DogCommand extends BunnyCommand {
    public constructor(client: YumekoClient) {
        super(client, "dog");
    }

    public async getImage(): Promise<string> {
        const { body }: any = await request.get("https://random.dog/woof.json");
        return body.url;
    }
}