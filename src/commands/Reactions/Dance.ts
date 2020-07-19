import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Dance extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "dance");
    }
}
