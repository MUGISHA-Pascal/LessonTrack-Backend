import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
  try {
    const user = await User.findOne({ where: { email } });
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
      if (parseInt(pin) === user.pin) { // assuming 'pin' is the field in your User model
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
      verified :"NO"
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
  } catch (error) {
    console.log(error);
  }
};

export const signup_Not_admin = async (req: Request, res: Response) => {
  const { username, phone_number } = req.body;
  try {
    // Create the user
    const userTest = await User.findOne({ where: { phone_number, verified: 'YES' } });
    console.log("userTest:", phone_number);
    console.log('Type of Phone Number:', typeof phone_number); // Logs its type
    

    if(!userTest){
      const user = await User.create({
        username,
        email: "",
        phone_number,
        password_hash: "",
        role: "lesson_seeker",
        verified: "NO"
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
    }else{
      res.status(200).json({
        success: 0
      })
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
