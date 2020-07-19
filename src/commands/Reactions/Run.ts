import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Run extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "run");
    }
}
