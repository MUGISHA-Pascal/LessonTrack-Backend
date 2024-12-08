import { ExtendedError, Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { userInterface } from "../interfaces/userInterface";
import User from "../models/User";
import Message from "../models/Message";
import Comment from "../models/Comments";
import { commentUpdate } from "./CommentController";
//--my codes
interface User {
  socketID: string;
}
interface SocketInterface extends Socket {
  user?: string;
}
// const userSockets = new Map();
export const handlingCharts = (io: Server) => {
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
  io.on("connection", async (socket: SocketInterface) => {
    // userSockets.set(socket.user, socket.id);
    socket.on("send_message", async ({ sender, receiver, message }) => {
      console.log(sender, receiver, message);
      try {
        const messageSaved = await Message.create({
          sender,
          receiver,
          message,
        });
        console.log("the message is saved ", messageSaved);
        io.to(socket.id).emit("server_sent", {
          message: messageSaved,
          messageType: "sent_message",
        });
      } catch (error) {
        socket.emit("error", { message: `Error sending the message ${error}` });
        console.log(error);
      }
    });
    socket.on("update_message", async ({ sender, receiver }) => {
      try {
        const messagesSender = await Message.findAll({
          where: {
            receiver: receiver,
            sender: sender,
          },
        });
        const messagesReceiver = await Message.findAll({
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
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("deleting_message", async ({ receiver, messageId }) => {
      try {
        const IfReceiverExist = await User.findOne({
          where: { email: receiver },
        });
        if (!IfReceiverExist) throw new Error("receiver doesnot exist");
        const IfExist = await Message.findAll({ where: { id: messageId } });
        if (!IfExist) throw new Error("message not found");
        const messageDeleted = await Message.destroy({
          where: { id: messageId },
        });
        console.log(messageDeleted);
        // const senderSocketId = userSockets.get(socket.user);
        // const receiverSocketId = userSockets.get(receiver);
        // io.to(senderSocketId).emit("message_delete", { receiver });
        // io.to(receiverSocketId).emit("message_delete", { sender: socket.user });
      } catch (error) {
        socket.emit("error", {
          message: `error while dealing with deleting of the message ${error}`,
        });
      }
    });
    socket.on("message_edit", async ({ id, message, receiver }) => {
      try {
        const receiverUser = await User.findOne({ where: { email: receiver } });
        if (!receiverUser) throw new Error("receiver not found");
        const updatedMessage = await Message.update(
          { message },
          { where: { id, receiver, sender: socket.user } }
        );
        if (!updatedMessage) throw new Error("message not updated");
        // const senderSocketId = userSockets.get(socket.user);
        // const receiverSocketId = userSockets.get(receiver);
        // io.to(senderSocketId).emit("message_update", { id, message });
        // io.to(receiverSocketId).emit("message_update", { id, message });
      } catch (error) {
        socket.emit("error", {
          message: `the error dealing with editing messages ${error}`,
        });
      }
    });
  });
};
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
