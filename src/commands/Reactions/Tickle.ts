import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Tickle extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "tickle");
    }
}
