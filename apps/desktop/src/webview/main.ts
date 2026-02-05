import { startApp } from "./app.js";
import { createElectrobunRpc } from "./rpc/electrobun.js";

startApp(createElectrobunRpc);
