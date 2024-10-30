import { Request, Response } from "express";
import User from "../models/User";
import Course from "../models/Courses";
export const courseAdding = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { title, description, content_type, is_active } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const course = await Course.create({
        title,
        description,
        content_type,
        created_by: Number(userId),
        is_active,
      });
      res.status(200).json({ message: "course created successfully", course });
    } else {
      res.json({ message: "you are not allowed adding courses" });
    }
  } catch (error) {
    console.log(error);
  }
};
