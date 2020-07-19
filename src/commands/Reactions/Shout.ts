import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Shout extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "shout");
    }
}
