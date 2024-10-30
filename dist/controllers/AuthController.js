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
exports.signup = exports.login = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const maxAge = 24 * 60 * 60;
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_KEY, { expiresIn: "1d" });
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, phone_number, password_hash, role } = req.body;
    try {
        const user = yield User_1.default.findOne({ where: { email } });
        if (user) {
            const auth = yield User_1.default.findOne({ where: { password_hash } });
            if (auth) {
                const token = createToken(auth.id);
                res.cookie("jwt", token, { maxAge: maxAge * 1000 });
                res.status(200).json({
                    message: "user found",
                    user: {
                        id: auth.id,
                        username: auth.username,
                        email: auth.email,
                        role: auth.role,
                    },
                });
            }
            else {
                res.status(401).json({ message: "user not found(password)" });
            }
        }
        else {
            res.status(401).json({ message: "user not found(email)" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, phone_number, password_hash, role } = req.body;
    try {
        const user = yield User_1.default.create({
            username,
            email,
            phone_number,
            password_hash,
            role,
        });
        const token = createToken(user.id);
        res.cookie("jwt", token, { maxAge: maxAge * 1000 });
        res.status(200).json({
            message: "user created",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.signup = signup;
