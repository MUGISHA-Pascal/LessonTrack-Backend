import { ExtendedError, Server, Socket } from "socket.io";
import io from "../server";
import jwt from "jsonwebtoken";
import { userInterface } from "../interfaces/userInterface";
import User from "../models/User";
import { where } from "sequelize";
import Message from "../models/Message";
import { kMaxLength } from "buffer";

interface SocketInterface extends Socket {
  user?: string;
}
const userSockets = new Map();
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
});
