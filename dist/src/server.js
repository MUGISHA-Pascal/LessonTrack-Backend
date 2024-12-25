"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const swagger_1 = __importDefault(require("./swagger"));
const ChatHandler_1 = require("./controllers/ChatHandler");
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Allow all origins; replace with specific frontend URL for security
        methods: ["GET", "POST"],
    },
});
// Test Express route
app_1.default.get("/", (req, res) => {
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
(0, swagger_1.default)(app_1.default, port);
(0, ChatHandler_1.handlingCharts)(io);
exports.default = io;
