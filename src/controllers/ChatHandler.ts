import { ExtendedError, Server, Socket } from "socket.io";
import io from "../server";
import jwt from "jsonwebtoken";
import { userInterface } from "../interfaces/userInterface";
import User from "../models/User";
import { where } from "sequelize";

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
      // const messageSaved = await
    } catch (error) {
      console.log(error);
    }
  });
});
