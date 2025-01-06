import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import Notification from "../models/Notification";
import { sendVerificationEmail } from "../utils/sendEmail";
const maxAge = 24 * 60 * 60;

const createToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_KEY as string, { expiresIn: "1d" });
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
export const login = async (req: Request, res: Response) => {
  let { email, password_hash } = req.body;
  const normalizedEmail = email.trim().toLowerCase(); // Trim spaces and normalize case

  try {
    const user = await User.findOne({
      where: { email: { [Op.iLike]: normalizedEmail } },
    });

    if (user) {
      const ismatch = await bcrypt.compare(password_hash, user.password_hash);
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
    } else {
      res.status(401).json({ message: "user not found(password)" });

      console.log("Request Body Password:", email);
      // console.log("Stored Hashed Password:", user.password_hash);
    }
  } catch (error) {
    console.log(error);
  }
};
export const loginForUser = async (req: Request, res: Response) => {
  let { phone_number, pin } = req.body;
  try {
    const user = await User.findOne({ where: { phone_number, pin } });
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
      } else {
        res.status(200).json({ message: pin });
      }
    } else {
      res.status(200).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

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
export const signup = async (req: Request, res: Response) => {
  const { username, email, phone_number, password_hash, role } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      phone_number,
      password_hash,
      role,
      verified: "yes",
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
  } catch (error) {
    console.log(error);
  }
};

export const webSignup = async (req: Request, res: Response) => {
  const { username, email, phone_number, password_hash, role } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      phone_number,
      password_hash,
      role,
      verified: "no",
      profilepicture: "default.png",
    });
    const token = createToken(user.id);
    await sendVerificationEmail(user.email, token);
    // res.cookie("jwt", token, { maxAge: maxAge * 1000 });
    res.status(200).json({
      message: "please verify your email",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilepicture: user.profilepicture,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
const verifyToken = (token: string) => {
  const secret = process.env.JWT_KEY;
  return jwt.verify(token, secret as string);
};
export const emailVerification = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const payload = verifyToken(token as string) as { id: number };
    const user = await User.findByPk(payload.id);
    console.log(user?.verified);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (user.verified === "yes") {
      res.status(200).json({ message: "Email already verified." });
      return;
    } else {
      user.verified = "yes";
      await user.save();

      res.status(200).json({ message: "Email successfully verified." });
      return;
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token." });
    return;
  }
};
export const signup_Not_admin = async (req: Request, res: Response) => {
  const { username, phone_number } = req.body;
  try {
    // Create the use
    const userTest = await User.findOne({
      where: { phone_number, verified: "yes" },
    });
    console.log("userTest:", phone_number);
    console.log("Type of Phone Number:", typeof phone_number); // Logs its type

    if (!userTest) {
      const user = await User.create({
        username,
        email: "",
        phone_number,
        password_hash: "",
        role: "lesson_seeker",
        verified: "no",
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
    } else {
      res.status(200).json({
        success: 0,
      });
    }
  } catch (error) {
    console.log(error);

    // Handle errors gracefully
    res.status(500).json({
      message: "An error occurred while creating the user",
      success: 0,
      error: "error.message",
    });
  }
};

export const WebLoginController = async (req: Request, res: Response) => {
  let { email, password_hash } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  console.log(email);

  try {
    const user = await User.findOne({
      where: { email: { [Op.iLike]: normalizedEmail } },
    });
    console.log("the email ", normalizedEmail, password_hash);
    if (user) {
      if (user.role === "admin" || user.role === "sub_admin") {
        const ismatch = await bcrypt.compare(password_hash, user.password_hash);
        console.log(user.password_hash);
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
              verified: user.verified,
            },
          });
          return;
        }

        if (ismatch === false) {
          console.log("Incorrect password for email:", normalizedEmail); // Log for debugging
          res.status(401).json({ message: "Incorrect password" });
          return;
        }
      } else {
        res.status(401).json({ message: "you are not the admin or sub admin" });
        return;
      }
    } else {
      res.status(401).json({ message: "user not found(password)" });

      console.log("Request Body Password:", email);
      return;
    }
  } catch (error) {
    console.log(error);
  }
};
