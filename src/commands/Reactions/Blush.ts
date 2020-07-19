import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Blush extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "blush");
    }
}
