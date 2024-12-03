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
// const userSockets = new Map();
const handlingCharts = (io) => {
    // io.use((socket: SocketInterface, next: (err?: ExtendedError) => void) => {
    //   const cookies = socket.request.headers.cookie;
    //   console.log(cookies)
    //   if (!cookies) {
    //     console.log("Fialed to get the cookies")
    //     return next(new Error("Invalid token"))
    //   };
    //   const accessToken: string = cookies["jwt"];
    //   if (!accessToken){
    //     console.log("Fialed to get the cookies")
    //     return next(new Error("Invalid token"))
    //   };
    //   jwt.verify(
    //     accessToken,
    //     process.env.JWT_KEY as string,
    //     async (err, decoded: any) => {
    //       let user = await User.findOne({ where: { email: decoded.email } });
    //       if (!user) return next(new Error("User not found"));
    //       let userAvailable = decoded as userInterface;
    //       if (err) return next(new Error("Invalid token"));
    //       socket.user = userAvailable.email;
    //       next();
    //     }
    //   );
    // });
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        // userSockets.set(socket.user, socket.id);
        socket.on("send_message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ sender, receiver, message }) {
            console.log(sender, receiver, message);
            try {
                const messageSaved = yield Message_1.default.create({
                    sender,
                    receiver,
                    message,
                });
                console.log("the message is saved ", messageSaved);
                io.to(socket.id).emit("server_sent", {
                    message: messageSaved,
                    messageType: "sent_message",
                });
            }
            catch (error) {
                socket.emit("error", { message: `Error sending the message ${error}` });
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
                // const senderSocketId = userSockets.get(socket.user);
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
                // const senderSocketId = userSockets.get(socket.user);
                // const receiverSocketId = userSockets.get(receiver);
                // io.to(senderSocketId).emit("message_delete", { receiver });
                // io.to(receiverSocketId).emit("message_delete", { sender: socket.user });
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
                // const senderSocketId = userSockets.get(socket.user);
                // const receiverSocketId = userSockets.get(receiver);
                // io.to(senderSocketId).emit("message_update", { id, message });
                // io.to(receiverSocketId).emit("message_update", { id, message });
            }
            catch (error) {
                socket.emit("error", {
                    message: `the error dealing with editing messages ${error}`,
                });
            }
        }));
    }));
};
exports.handlingCharts = handlingCharts;
//   socket.on("typing", async ({ receiver }) => {
//     try {
//       const receiverUser = await User.findOne({ where: { email: receiver } });
//       if (!receiverUser) throw new Error("receiver not found");
//       const senderSocketId = userSockets.get(socket.user);
//       const receiverSocketId = userSockets.get(receiver);
//       io.to(senderSocketId).emit("typing", { receiver });
//       io.to(receiverSocketId).emit("message_update", { sender: socket.user });
//     } catch (error) {
//       socket.emit("error", {
//         message: `error dealing with typing of message ${error}`,
//       });
//     }
//   });
//   socket.on("commenting", async ({ comment, courseId }) => {
//     try {
//       const user = await User.findOne({ where: { email: socket.user } });
//       if (!user) throw new Error("error while finding the user");
//       await Comment.create({
//         user_id: user?.id,
//         comment_text: comment,
//         course_id: courseId,
//       });
//       const comments = await Comment.findAll({
//         limit: 50,
//         order: [["createdAt", "DESC"]],
//       });
//       io.emit("commentUpdate", { comments });
//     } catch (error) {
//       socket.emit("error", { message: error });
//     }
//   });
//   socket.on("deleting_comment", async ({ commentId }) => {
//     try {
//       const CommentDelete = await Comment.destroy({ where: { id: commentId } });
//       if (!CommentDelete) throw new Error("comment not deleted");
//       const comments = await Comment.findAll({
//         limit: 50,
//         order: [["createdAt", "DESC"]],
//       });
//       io.emit("commentUpdate", { comments });
//     } catch (error) {
//       socket.emit("error", { message: error });
//     }
//   });
//   socket.on("comment_update", async ({ commentUpdate, courseId }) => {
//     try {
//       const commentUpdated = await Comment.update(
//         { comment_text: commentUpdate },
//         { where: { course_id: courseId } }
//       );
//       if (!commentUpdated) throw new Error("comment not updated");
//       const comments = await Comment.findAll({
//         limit: 50,
//         order: [["createdAt", "DESC"]],
//       });
//       io.emit("commentUpdate", { comments });
//     } catch (error) {
//       socket.emit("error", {
//         message: `error while dealing with updating ${error}`,
//       });
//     }
//   });
//   socket.on("commentUpdate", async () => {
//     try {
//       const comments = await Comment.findAll({
//         limit: 50,
//         order: [["createdAt", "DESC"]],
//       });
//       io.emit("commentUpdate", { comments });
//     } catch (error) {
//       socket.emit("error", { message: error });
//     }
//   });
//   socket.on("disconnect", () => {
//     userSockets.delete(socket.user);
//   });
// });
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
