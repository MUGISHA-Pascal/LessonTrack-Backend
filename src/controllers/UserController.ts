import { Request, Response } from "express";
import User from "../models/User";
export const profileUploadController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = id;
    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      if (req.file) {
        user.profilePicture = req.file.path;
        user.save();
        res.json({ message: "user image uploaded successfully", user });
      } else {
        res.status(400).json({ message: "no image file uploaded" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const AdminUserDelete = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { deleteUserId } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const deletedUsers = await User.destroy({ where: { id: deleteUserId } });
      res.json({ message: "user deleted successfully", deletedUsers });
    } else {
      res.json({ message: "you are not elligible to delete users" });
    }
  } catch (error) {
    console.log(error);
  }
};
