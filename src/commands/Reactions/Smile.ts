import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Smile extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "smile");
    }
}
