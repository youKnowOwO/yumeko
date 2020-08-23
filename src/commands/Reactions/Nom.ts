import YumekoClient from "@yumeko/classes/Client";
import AmazedCommand from "@yumeko/commands/Reactions/Amazed";

export default class Nom extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "nom");
    }
}
