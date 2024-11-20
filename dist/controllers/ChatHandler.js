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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
