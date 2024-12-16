import http from "http";
import { Server } from "socket.io";
import app from "./app";
import swaggerDocs from "./swagger";
import { handlingCharts } from "./controllers/chatHandler";

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = process.env.PORT;
server.listen(port, () => {
  console.log("server running on port " + port);
});
swaggerDocs(app, port);
handlingCharts(io);
export default io;

