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
exports.WebLoginController = exports.signup_Not_admin = exports.signup = exports.loginForUser = exports.login = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const maxAge = 24 * 60 * 60;
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_KEY, { expiresIn: "1d" });
};
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: "user@example.com"
 *               password_hash:
 *                 type: string
 *                 description: User's password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user found"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Unauthorized (incorrect email or password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user not found(email)"
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password_hash } = req.body;
    const normalizedEmail = email.trim().toLowerCase(); // Trim spaces and normalize case
    try {
        const user = yield User_1.default.findOne({
            where: { email: { [sequelize_1.Op.iLike]: normalizedEmail } },
        });
        if (user) {
            const ismatch = yield bcrypt_1.default.compare(password_hash, user.password_hash);
            if (ismatch) {
                const token = createToken(user.id);
                res.cookie("jwt", token, { maxAge: maxAge * 1000 });
                res.status(200).json({
                    message: "user found",
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    },
                });
            }
        }
        else {
            res.status(401).json({ message: "user not found(password)" });
            console.log("Request Body Password:", email);
            // console.log("Stored Hashed Password:", user.password_hash);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.login = login;
const loginForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { phone_number, pin } = req.body;
    try {
        const user = yield User_1.default.findOne({ where: { phone_number, pin } });
        if (user) {
            // Compare the plain pin number
            if (parseInt(pin) === user.pin) {
                // assuming 'pin' is the field in your User model
                const token = createToken(user.id);
                res.cookie("jwt", token, { maxAge: maxAge * 1000 });
                res.status(200).json({
                    message: "user found",
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    },
                });
            }
            else {
                res.status(200).json({ message: pin });
            }
        }
        else {
            res.status(200).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.loginForUser = loginForUser;
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               phone_number:
 *                 type: string
 *                 example: "123-456-7890"
 *               password_hash:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user created"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Bad request, missing or invalid data
 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, phone_number, password_hash, role } = req.body;
    try {
        const user = yield User_1.default.create({
            username,
            email,
            phone_number,
            password_hash,
            role,
            verified: "NO",
            profilepicture: "default.png",
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
                profilepicture: user.profilepicture,
            },
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.signup = signup;
const signup_Not_admin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, phone_number } = req.body;
    try {
        // Create the user
        const userTest = yield User_1.default.findOne({
            where: { phone_number, verified: "YES" },
        });
        console.log("userTest:", phone_number);
        console.log("Type of Phone Number:", typeof phone_number); // Logs its type
        if (!userTest) {
            const user = yield User_1.default.create({
                username,
                email: "",
                phone_number,
                password_hash: "",
                role: "lesson_seeker",
                verified: "NO",
                profilepicture: "default.png",
            });
            // Generate a token
            const token = createToken(user.id);
            // Set the token in cookies
            res.cookie("jwt", token, { maxAge: maxAge * 1000 });
            // Return the success response with the user id
            res.status(200).json({
                message: "User created successfully",
                user: {
                    id: user.id, // Include the created user's id
                    username: username,
                    phone_number: phone_number,
                },
                success: 1,
            });
        }
        else {
            res.status(200).json({
                success: 0,
            });
        }
    }
    catch (error) {
        console.log(error);
        // Handle errors gracefully
        res.status(500).json({
            message: "An error occurred while creating the user",
            success: 0,
            error: "error.message",
        });
    }
});
exports.signup_Not_admin = signup_Not_admin;
const WebLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password_hash } = req.body;
    const normalizedEmail = email.trim().toLowerCase(); // Trim spaces and normalize case
    try {
        const user = yield User_1.default.findOne({
            where: { email: { [sequelize_1.Op.iLike]: normalizedEmail } },
        });
        if (user) {
            if (user.role === "admin") {
                const ismatch = yield bcrypt_1.default.compare(password_hash, user.password_hash);
                if (ismatch) {
                    const token = createToken(user.id);
                    res.cookie("jwt", token, { maxAge: maxAge * 1000 });
                    res.status(200).json({
                        message: "user found",
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.role,
                            phone_number: user.phone_number,
                            profilepicture: user.profilepicture,
                        },
                    });
                }
            }
            else {
                res.status(401).json({ message: "you are not the admin" });
            }
        }
        else {
            res.status(401).json({ message: "user not found(password)" });
            console.log("Request Body Password:", email);
            // console.log("Stored Hashed Password:", user.password_hash);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.WebLoginController = WebLoginController;
