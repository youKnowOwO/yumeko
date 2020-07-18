import type YumekoClient from "../../classes/Client";
import BunnyCommand from "./Bunny";
import request from "node-superfetch";

export default class BirbCommand extends BunnyCommand {
    public constructor(client: YumekoClient) {
        super(client, "birb");
    }

    public async getImage(): Promise<string> {
        const { body }: any = await request.get("https://api.alexflipnote.dev/birb");
        return body.file;
    }
}