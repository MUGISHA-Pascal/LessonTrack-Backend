import { ExtendedError, Server, Socket } from "socket.io";
import io from "../server";
import jwt from "jsonwebtoken";
import { userInterface } from "../interfaces/userInterface";

interface SocketInterface extends Socket {
  user?: string;
}
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
