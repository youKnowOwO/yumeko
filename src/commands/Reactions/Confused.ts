import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Confused extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "confused");
    }
}
