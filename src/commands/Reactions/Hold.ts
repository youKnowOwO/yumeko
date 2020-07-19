import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Hold extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "hold");
    }
}
