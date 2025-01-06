import { ExtendedError, Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { userInterface } from "../interfaces/userInterface";
import User from "../models/User";
import Message from "../models/Message";
import Comment from "../models/Comments";
import { commentUpdate } from "./CommentController";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";
interface User {
  socketID: string;
}
interface SocketInterface extends Socket {
  user?: string;
}
export const handlingCharts = (io: Server) => {
  io.on("connection", async (socket: SocketInterface) => {
    socket.on("send_message", async ({ sender, receiver, message, type , date}) => {
      console.log(sender, receiver, message);
      // console.log(dateWithTime);

      try {

        const messageSaved = await Message.create({
          sender,
          receiver,
          message,
          date,
          type,
        });
        console.log("the message is saved ", messageSaved);
        io.to(socket.id).emit("server_sent", {
          message: messageSaved,
          messageType: "sent_message",
        });
      } catch (error) {
        socket.emit("error", {
          message: `Error sending the message ${error} ${receiver}`,
        });
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
      } catch (error) {
        socket.emit("error", {
          message: `the error dealing with editing messages ${error}`,
        });
      }
    });
    socket.on("last_message", async ({ activeUser, role }) => {
      console.log(
        "Event 'last_message' received for activeUser ID:",
        activeUser
      );

      try {
       // Fetch all sub-admins with verified = "YES"
const subAdmins = await User.findAll({
  where: {
    role: role,
    verified: { [Op.iLike]: "YES" },
  },
});


const usersWithLastMessage = await Promise.all(
  subAdmins.map(async (user) => {
    const lastMessage = await Message.findOne({
      where: {
        [Op.or]: [
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
      order: [["id", "DESC"]],
    });

    return {
      user: user.id,
      lastMessage: lastMessage ? lastMessage.message : "No messages yet",
      timestamp: lastMessage ? lastMessage.date : null,
      username: user.username,
      profilepicture: user.profilepicture,
      sender: lastMessage ? lastMessage.sender : null,
      receiver: lastMessage ? lastMessage.receiver : null,
      status: user.activestatus,
      email: user.email,
      type: lastMessage?.type
    };
  })
);

// Ensure the order is maintained as subAdmins array order
console.log("Fetched sub-admins IDs:", subAdmins.map((u) => u.id));
console.log("Users with Last Message:", usersWithLastMessage);


        io.to(socket.id).emit("last_message_update", usersWithLastMessage);
      } catch (error) {
        console.error("Error fetching last messages:", error);
        socket.emit("error", { message: "Failed to fetch last messages" });
      }
    });
    socket.on("fetch_messages", async ({ sender, receiver }) => {
      const senderId = sender.toString(); // Convert sender to string
      const receiverId = receiver.toString(); // Convert receiver to string
      try {
        const senderId = sender.toString(); // Convert sender to string
        const receiverId = receiver.toString(); // Convert receiver to string

        const messages = await Message.findAll({
          where: {
            [Op.or]: [
              { sender: senderId, receiver: receiverId },
              { sender: receiverId, receiver: senderId },
            ],
          },
          order: [["date", "ASC"]],
        });

        // Send the fetched messages back to the client
        io.to(socket.id).emit("fetched_messages", messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        socket.emit("error", { message: "Error fetching messages" });
      }
    });

    socket.on("sendFile", async ({message, receiver, sender, type, date}) => {
      const { fileName, fileContent } = message;
  
      const filePath = path.join(__dirname, "../../uploads/messages", fileName);
      fs.writeFileSync(filePath, fileContent, "base64");
      await Message.create({
        sender,
        receiver,
        message: fileName,
        date,
        type
      });

    });
  
  });
};

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
