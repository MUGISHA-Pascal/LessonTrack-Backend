import http from "http";
import { Server } from "socket.io";
import app from "./app";
import swaggerDocs from "./swagger";

const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT;
server.listen(port, () => {
  console.log("server running on port " + port);
});
swaggerDocs(app, port);
