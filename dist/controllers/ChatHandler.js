"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Message_1 = __importDefault(require("../models/Message"));
const userSockets = new Map();
const handleChat = (io) => __awaiter(void 0, void 0, void 0, function* () {
    io.use((socket, next) => {
        const cookies = socket.handshake.headers;
        if (!cookies)
            return next(new Error("Invalid token"));
        const accessToken = cookies["x-access-token"];
        if (!accessToken)
            return next(new Error("Invalid token"));
        jsonwebtoken_1.default.verify(accessToken, process.env.JWT_KEY, (err, decoded) => {
            let user = decoded;
            if (err)
                return next(new Error("Invalid token"));
            socket.user = user.email;
            next();
        });
    });
});
server_1.default.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    userSockets.set(socket.user, socket.id);
    socket.on("send_message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ receiver, message }) {
        try {
            const receiverUser = yield User_1.default.findOne({ where: { email: receiver } });
            if (!receiverUser)
                throw new Error("user not found");
            const messageSaved = yield Message_1.default.create({
                sender: socket.user ? socket.user : "unknown",
                receiver,
                message,
            });
            const senderSocketId = userSockets.get(socket.user);
            const receiverSocketId = userSockets.get(receiver);
            server_1.default.to(receiverSocketId).emit("receive_message", {
                message: messageSaved,
                messageType: "dm",
            });
            server_1.default.to(senderSocketId).emit("message_sent", {
                message: messageSaved,
                messageType: "sent_message",
            });
        }
        catch (error) {
            console.log("Error sending the message ", error);
        }
    }));
    socket.on("message_reply", (_a) => __awaiter(void 0, [_a], void 0, function* ({ receiver, message, repliedMessageId, messageReply }) {
        try {
            const sender = socket.user;
            const messageReplySave = yield Message_1.default.create({
                sender: sender ? sender : "unknown",
                receiver,
                message,
                repliedTo: repliedMessageId,
            });
            const senderSocketId = userSockets.get(socket.user);
            const receiverSocketId = userSockets.get(receiver);
            server_1.default.to(senderSocketId).emit("message_reply", { message, messageReply });
            server_1.default.to(receiverSocketId).emit("message_reply_receive", {
                message,
                messageReply,
            });
        }
        catch (error) {
            console.log("error with dealing with replied message ", error);
        }
    }));
    socket.on("deleting_message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ receiver, messageId }) {
        try {
            const messageDeleted = yield Message_1.default.destroy({
                where: { id: messageId },
            });
            console.log(messageDeleted);
            const senderSocketId = userSockets.get(socket.user);
            const receiverSocketId = userSockets.get(receiver);
            server_1.default.to(senderSocketId).emit("message_delete", { receiver });
            server_1.default.to(receiverSocketId).emit("message_delete", { sender: socket.user });
        }
        catch (error) {
            console.log("error while dealing with deleting of the message ", error);
        }
    }));
}));
