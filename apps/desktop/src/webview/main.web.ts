import { startApp } from "./app.js";
import { createWebRpcClient } from "./rpc/web.js";

startApp(createWebRpcClient);
