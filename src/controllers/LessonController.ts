import { Request, Response } from "express";
import User from "../models/User";
import Course from "../models/Courses";
import Lesson from "../models/Lessons";
export const lessonAdding = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { title, course_id, content, media_url } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const lesson = await Lesson.create({
        title,
        course_id,
        content,
        media_url,
      });
      res.status(200).json({ message: "lesson created successfully", lesson });
    } else {
      res.json({ message: "you are not allowed adding lessons" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getLesson = async (req: Request, res: Response) => {
  try {
    if (req.body.title) {
      const { title } = req.body;
      const courseFound = await Course.findAll({ where: { title } });
      if (!courseFound) {
        res.json({ message: "course not found" });
      }
      res.status(200).json({ message: "course found", courses: courseFound });
    } else {
      const courses = await Course.findAll();
      res.status(200).json({ message: "all courses", courses });
    }
  } catch (error) {
    console.log(error);
  }
};

export const lessonUpdate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { lessonId, title, content, course_id, media_url } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const updatedLesson = await Lesson.update(
        { title, content, media_url },
        { where: { id: lessonId, course_id } }
      );
      res
        .status(200)
        .json({ message: "lesson updated successfully", updatedLesson });
    } else {
      res.json({ message: "you are not allowed updating lessons" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const lessonDelete = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { lessonId } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const deletedLesson = await Lesson.destroy({ where: { id: lessonId } });
      res
        .status(200)
        .json({ message: "lesson deleted successfully", deletedLesson });
    } else {
      res.json({ message: "you are not allowed deleting lessons" });
    }
  } catch (error) {
    console.log(error);
  }
};
