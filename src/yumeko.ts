import YumekoClient from "./classes/Client";

const client = new YumekoClient();
client.login(process.env.TOKEN);