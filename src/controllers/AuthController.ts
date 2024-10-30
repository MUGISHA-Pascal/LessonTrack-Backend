import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
const maxAge = 24 * 60 * 60;

const createToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_KEY as string, { expiresIn: "1d" });
};

export const login = async (req: Request, res: Response) => {
  const { username, email, phone_number, password_hash, role } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const auth = await User.findOne({ where: { password_hash } });
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
      } else {
        res.status(401).json({ message: "user not found(password)" });
      }
    } else {
      res.status(401).json({ message: "user not found(email)" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const signup = async (req: Request, res: Response) => {
  const { username, email, phone_number, password_hash, role } = req.body;
  try {
    const user = await User.create({
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
  } catch (error) {
    console.log(error);
  }
};
