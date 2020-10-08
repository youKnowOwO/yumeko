import YumekoClient from "./classes/Client";

if (process.argv[2] === "dev") {
    require("./util/EnvLoader");
    require("../config.json").dev = true;
}

const client = new YumekoClient();
client.login(process.env.TOKEN);