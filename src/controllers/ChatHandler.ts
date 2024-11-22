import { ExtendedError, Server, Socket } from "socket.io";
import io from "../server";
import jwt from "jsonwebtoken";
import { userInterface } from "../interfaces/userInterface";
import User from "../models/User";
import Message from "../models/Message";

interface SocketInterface extends Socket {
  user?: string;
}
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
const handleChat = async (io: Server) => {
  io.use((socket: SocketInterface, next: (err?: ExtendedError) => void) => {
    const cookies = socket.handshake.headers;
    if (!cookies) return next(new Error("Invalid token"));
    const accessToken: string = cookies["x-access-token"] as string;
    if (!accessToken) return next(new Error("Invalid token"));
    jwt.verify(
      accessToken,
      process.env.JWT_KEY as string,
      (err, decoded: any) => {
        let user = decoded as userInterface;
        if (err) return next(new Error("Invalid token"));
        socket.user = user.email;
        next();
      }
    );
  });
};

io.on("connection", async (socket: SocketInterface) => {
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

  socket.on("send_message", async ({ receiver, message }) => {
    try {
      const receiverUser = await User.findOne({ where: { email: receiver } });
      if (!receiverUser) throw new Error("user not found");
      const messageSaved = await Message.create({
        sender: socket.user ? socket.user : "unknown",
        receiver,
        message,
      });
      const senderSocketId = userSockets.get(socket.user);
      const receiverSocketId = userSockets.get(receiver);
      io.to(receiverSocketId).emit("receive_message", {
        message: messageSaved,
        messageType: "dm",
      });
      io.to(senderSocketId).emit("message_sent", {
        message: messageSaved,
        messageType: "sent_message",
      });
    } catch (error) {
      console.log("Error sending the message ", error);
    }
  });
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
  socket.on(
    "message_reply",
    async ({ receiver, message, repliedMessageId, messageReply }) => {
      try {
        const sender = socket.user;
        const messageReplySave = await Message.create({
          sender: sender ? sender : "unknown",
          receiver,
          message,
          repliedTo: repliedMessageId,
        });
        const senderSocketId = userSockets.get(socket.user);
        const receiverSocketId = userSockets.get(receiver);
        io.to(senderSocketId).emit("message_reply", { message, messageReply });
        io.to(receiverSocketId).emit("message_reply_receive", {
          message,
          messageReply,
        });
      } catch (error) {
        console.log("error with dealing with replied message ", error);
      }
    }
  );
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
  socket.on("deleting_message", async ({ receiver, messageId }) => {
    try {
      const messageDeleted = await Message.destroy({
        where: { id: messageId },
      });
      console.log(messageDeleted);
      const senderSocketId = userSockets.get(socket.user);
      const receiverSocketId = userSockets.get(receiver);
      io.to(senderSocketId).emit("message_delete", { receiver });
      io.to(receiverSocketId).emit("message_delete", { sender: socket.user });
    } catch (error) {
      console.log("error while dealing with deleting of the message ", error);
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
      const senderSocketId = userSockets.get(socket.user);
      const receiverSocketId = userSockets.get(receiver);
      io.to(senderSocketId).emit("message_update", { id, message });
      io.to(receiverSocketId).emit("message_update", { id, message });
    } catch (error) {
      console.log("the error dealing with editing messages ", error);
    }
  });
  socket.on("typing", async (receiver) => {
    try {
      const receiverUser = await User.findOne({ where: { email: receiver } });
      if (!receiverUser) throw new Error("receiver not found");
      const senderSocketId = userSockets.get(socket.user);
      const receiverSocketId = userSockets.get(receiver);
      io.to(senderSocketId).emit("typing", { receiver });
      io.to(receiverSocketId).emit("message_update", { sender: socket.user });
    } catch (error) {
      console.log("error dealing with typing of message ", error);
    }
  });
});
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
