import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Kiss extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "kiss");
    }
}
