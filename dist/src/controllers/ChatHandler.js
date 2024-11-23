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
const Comments_1 = __importDefault(require("../models/Comments"));
const userSockets = new Map();
/**
 * @swagger
 * components:
 *   schemas:
 *     SendMessage:
 *       type: object
 *       properties:
 *         receiver:
 *           type: string
 *           description: Email of the receiver.
 *         message:
 *           type: string
 *           description: The message to be sent.
 *       required:
 *         - receiver
 *         - message
 *     MessageReply:
 *       type: object
 *       properties:
 *         receiver:
 *           type: string
 *           description: Email of the receiver.
 *         message:
 *           type: string
 *           description: The message reply content.
 *         repliedMessageId:
 *           type: string
 *           description: The ID of the message being replied to.
 *         messageReply:
 *           type: string
 *           description: The reply itself.
 *       required:
 *         - receiver
 *         - message
 *         - repliedMessageId
 *         - messageReply
 *     DeleteMessage:
 *       type: object
 *       properties:
 *         receiver:
 *           type: string
 *           description: Email of the receiver.
 *         messageId:
 *           type: string
 *           description: The ID of the message to be deleted.
 *       required:
 *         - receiver
 *         - messageId
 */
/**
 * Middleware for authenticating WebSocket connections.
 * @param {Server} io - The Socket.IO server instance.
 */
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
    /**
     * @swagger
     * /send_message:
     *   post:
     *     summary: Send a direct message to another user.
     *     tags:
     *       - Chat
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SendMessage'
     *     responses:
     *       200:
     *         description: Message successfully sent.
     *       404:
     *         description: Receiver not found.
     *       500:
     *         description: Server error.
     */
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
    /**
     * @swagger
     * /message_reply:
     *   post:
     *     summary: Reply to a specific message.
     *     tags:
     *       - Chat
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/MessageReply'
     *     responses:
     *       200:
     *         description: Reply successfully sent.
     *       500:
     *         description: Server error.
     */
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
    /**
     * @swagger
     * /deleting_message:
     *   post:
     *     summary: Delete a specific message.
     *     tags:
     *       - Chat
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/DeleteMessage'
     *     responses:
     *       200:
     *         description: Message successfully deleted.
     *       500:
     *         description: Server error.
     */
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
    socket.on("message_edit", (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, message, receiver }) {
        try {
            const receiverUser = yield User_1.default.findOne({ where: { email: receiver } });
            if (!receiverUser)
                throw new Error("receiver not found");
            const updatedMessage = yield Message_1.default.update({ message }, { where: { id, receiver, sender: socket.user } });
            const senderSocketId = userSockets.get(socket.user);
            const receiverSocketId = userSockets.get(receiver);
            server_1.default.to(senderSocketId).emit("message_update", { id, message });
            server_1.default.to(receiverSocketId).emit("message_update", { id, message });
        }
        catch (error) {
            console.log("the error dealing with editing messages ", error);
        }
    }));
    socket.on("typing", (_a) => __awaiter(void 0, [_a], void 0, function* ({ receiver }) {
        try {
            const receiverUser = yield User_1.default.findOne({ where: { email: receiver } });
            if (!receiverUser)
                throw new Error("receiver not found");
            const senderSocketId = userSockets.get(socket.user);
            const receiverSocketId = userSockets.get(receiver);
            server_1.default.to(senderSocketId).emit("typing", { receiver });
            server_1.default.to(receiverSocketId).emit("message_update", { sender: socket.user });
        }
        catch (error) {
            console.log("error dealing with typing of message ", error);
        }
    }));
    socket.on("commenting", (_a) => __awaiter(void 0, [_a], void 0, function* ({ comment, courseId }) {
        try {
            const user = yield User_1.default.findOne({ where: { email: socket.user } });
            yield Comments_1.default.create({
                user_id: (user === null || user === void 0 ? void 0 : user.id) ? user.id : 1,
                comment_text: comment,
                course_id: courseId,
            });
            const comments = yield Comments_1.default.findAll({
                limit: 50,
                order: [["createdAt", "DESC"]],
            });
            server_1.default.emit("commentUpdate", { comments });
        }
        catch (error) {
            console.log(error);
        }
    }));
    socket.on("deleting_comment", (_a) => __awaiter(void 0, [_a], void 0, function* ({ commentId }) {
        try {
            const CommentDelete = yield Comments_1.default.destroy({ where: { id: commentId } });
            if (!CommentDelete)
                throw new Error("comment not deleted");
            const comments = yield Comments_1.default.findAll({
                limit: 50,
                order: [["createdAt", "DESC"]],
            });
            server_1.default.emit("commentUpdate", { comments });
        }
        catch (error) {
            console.log(error);
        }
    }));
    socket.on("comment_update", (_a) => __awaiter(void 0, [_a], void 0, function* ({ commentUpdate, courseId }) {
        try {
            const commentUpdated = yield Comments_1.default.update({ comment_text: commentUpdate }, { where: { course_id: courseId } });
            if (!commentUpdated)
                throw new Error("comment not updated");
            const comments = yield Comments_1.default.findAll({
                limit: 50,
                order: [["createdAt", "DESC"]],
            });
            server_1.default.emit("commentUpdate", { comments });
        }
        catch (error) {
            console.log("error while dealing with updating ", error);
        }
    }));
    socket.on("commentUpdate", () => __awaiter(void 0, void 0, void 0, function* () {
        const comments = yield Comments_1.default.findAll({
            limit: 50,
            order: [["createdAt", "DESC"]],
        });
        server_1.default.emit("commentUpdate", { comments });
    }));
}));
/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the message.
 *         sender:
 *           type: string
 *           description: Email or identifier of the sender.
 *         message:
 *           type: string
 *           description: Content of the message.
 *         receiver:
 *           type: string
 *           description: Email or identifier of the receiver.
 *         seen:
 *           type: boolean
 *           description: Whether the message has been read by the receiver.
 *         edited:
 *           type: boolean
 *           description: Whether the message has been edited.
 *         repliedTo:
 *           type: array
 *           items:
 *             type: integer
 *           description: Array of IDs of the messages this message is replying to.
 *       required:
 *         - sender
 *         - message
 *         - receiver
 *         - seen
 *         - edited
 *       example:
 *         id: 1
 *         sender: sender@example.com
 *         message: "Hello, how are you?"
 *         receiver: receiver@example.com
 *         seen: true
 *         edited: false
 *         repliedTo: [5, 10]
 */
