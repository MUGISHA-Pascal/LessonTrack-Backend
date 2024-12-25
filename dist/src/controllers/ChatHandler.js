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
exports.handlingCharts = void 0;
const User_1 = __importDefault(require("../models/User"));
const Message_1 = __importDefault(require("../models/Message"));
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlingCharts = (io) => {
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        socket.on("send_message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ sender, receiver, message, type }) {
            console.log(sender, receiver, message);
            // console.log(dateWithTime);
            try {
                const date = new Date("2024-06-17T14:30:00");
                const messageSaved = yield Message_1.default.create({
                    sender,
                    receiver,
                    message,
                    date: `${date}`,
                    type,
                });
                console.log("the message is saved ", messageSaved);
                io.to(socket.id).emit("server_sent", {
                    message: messageSaved,
                    messageType: "sent_message",
                });
            }
            catch (error) {
                socket.emit("error", {
                    message: `Error sending the message ${error} ${receiver}`,
                });
                console.log(error);
            }
        }));
        socket.on("update_message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ sender, receiver }) {
            try {
                const messagesSender = yield Message_1.default.findAll({
                    where: {
                        receiver: receiver,
                        sender: sender,
                    },
                });
                const messagesReceiver = yield Message_1.default.findAll({
                    where: {
                        receiver: sender,
                        sender: receiver,
                    },
                });
                io.to(socket.id).emit("message_update", {
                    receiver,
                    messagesSender,
                    messagesReceiver,
                });
            }
            catch (error) {
                console.log(error);
            }
        }));
        socket.on("deleting_message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ receiver, messageId }) {
            try {
                const IfReceiverExist = yield User_1.default.findOne({
                    where: { email: receiver },
                });
                if (!IfReceiverExist)
                    throw new Error("receiver doesnot exist");
                const IfExist = yield Message_1.default.findAll({ where: { id: messageId } });
                if (!IfExist)
                    throw new Error("message not found");
                const messageDeleted = yield Message_1.default.destroy({
                    where: { id: messageId },
                });
                console.log(messageDeleted);
            }
            catch (error) {
                socket.emit("error", {
                    message: `error while dealing with deleting of the message ${error}`,
                });
            }
        }));
        socket.on("message_edit", (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, message, receiver }) {
            try {
                const receiverUser = yield User_1.default.findOne({ where: { email: receiver } });
                if (!receiverUser)
                    throw new Error("receiver not found");
                const updatedMessage = yield Message_1.default.update({ message }, { where: { id, receiver, sender: socket.user } });
                if (!updatedMessage)
                    throw new Error("message not updated");
            }
            catch (error) {
                socket.emit("error", {
                    message: `the error dealing with editing messages ${error}`,
                });
            }
        }));
        socket.on("last_message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ activeUser, role }) {
            console.log("Event 'last_message' received for activeUser ID:", activeUser);
            try {
                // Fetch all sub-admins with verified = "YES"
                const subAdmins = yield User_1.default.findAll({
                    where: {
                        role: role,
                        verified: { [sequelize_1.Op.iLike]: "YES" },
                    },
                });
                const allUsers = yield User_1.default.findAll();
                console.log("All Users:", allUsers);
                console.log("Fetched sub-admins IDs:", subAdmins.map((u) => u.id));
                const usersWithLastMessage = yield Promise.all(subAdmins.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                    const lastMessage = yield Message_1.default.findOne({
                        where: {
                            [sequelize_1.Op.or]: [
                                {
                                    sender: activeUser.toString(),
                                    receiver: user.id.toString(),
                                },
                                {
                                    sender: user.id.toString(),
                                    receiver: activeUser.toString(),
                                },
                            ],
                        },
                        order: [["createdAt", "DESC"]],
                    });
                    return {
                        user: user.id,
                        lastMessage: lastMessage
                            ? lastMessage.message
                            : "No messages yet",
                        timestamp: lastMessage ? lastMessage.date : null,
                        username: user.username,
                        profilePicture: user.profilepicture,
                        sender: lastMessage ? lastMessage.sender : null,
                        receiver: lastMessage ? lastMessage.receiver : null,
                        status: user.activestatus,
                    };
                })));
                io.to(socket.id).emit("last_message_update", usersWithLastMessage);
            }
            catch (error) {
                console.error("Error fetching last messages:", error);
                socket.emit("error", { message: "Failed to fetch last messages" });
            }
        }));
        socket.on("fetch_messages", (_a) => __awaiter(void 0, [_a], void 0, function* ({ sender, receiver }) {
            const senderId = sender.toString(); // Convert sender to string
            const receiverId = receiver.toString(); // Convert receiver to string
            try {
                const senderId = sender.toString(); // Convert sender to string
                const receiverId = receiver.toString(); // Convert receiver to string
                const messages = yield Message_1.default.findAll({
                    where: {
                        [sequelize_1.Op.or]: [
                            { sender: senderId, receiver: receiverId },
                            { sender: receiverId, receiver: senderId },
                        ],
                    },
                    order: [["date", "ASC"]],
                });
                // Send the fetched messages back to the client
                io.to(socket.id).emit("fetched_messages", messages);
            }
            catch (error) {
                console.error("Error fetching messages:", error);
                socket.emit("error", { message: "Error fetching messages" });
            }
        }));
        socket.on("sendFile", (fileData, receiver, sender) => __awaiter(void 0, void 0, void 0, function* () {
            const { fileName, fileContent } = fileData;
            const filePath = path_1.default.join(__dirname, "uploads/messages", fileName);
            fs_1.default.writeFileSync(filePath, fileContent, "base64");
            yield Message_1.default.create({
                sender,
                receiver,
                message: fileName,
                fileContent,
            });
        }));
    }));
};
exports.handlingCharts = handlingCharts;
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
