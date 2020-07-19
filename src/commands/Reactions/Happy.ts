import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Happy extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "happy");
    }
}
