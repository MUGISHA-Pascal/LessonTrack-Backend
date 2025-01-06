import http from "http";
import { Server } from "socket.io";
import app from "./app";
import swaggerDocs from "./swagger";
import { handlingCharts } from "./controllers/ChatHandler";
import postgresConnectionSequelize from "./config/postgres";
const server = http.createServer(app);
postgresConnectionSequelize

  .authenticate()
  .then(() => {
    console.log("connected to the db");
  })
  .catch((error) => {
    console.log("not connected ", error);
  });
postgresConnectionSequelize.sync({ alter: true });
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins; replace with specific frontend URL for security
    methods: ["GET", "POST"],
  },
});

// Test Express route
app.get("/", (req, res) => {
  res.send("Socket.IO Server Running");
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
const port = process.env.PORT;
server.listen(port, () => {
  console.log("server running on port " + port);
});

swaggerDocs(app, port);
handlingCharts(io);
export default io;
