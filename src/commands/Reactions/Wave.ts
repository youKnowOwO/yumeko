import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Wave extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "wave");
    }
}
