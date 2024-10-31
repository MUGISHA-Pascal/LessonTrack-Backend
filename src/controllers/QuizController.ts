import { Request, Response } from "express";
import User from "../models/User";
import Quiz from "../models/Quiz";
export const quizAdding = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { course_id, title, max_attempts } = req.body;
    const userEligible = await User.findOne({ where: { id: userId } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const quiz = await Quiz.create({
        course_id,
        title,
        max_attempts,
      });
      res.status(200).json({ message: "quiz added successfully", quiz });
    } else {
      res.json({ message: "you are not elligible to add quiz" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const { course_id } = req.body;
    const quiz = await Quiz.findAll({
      where: { course_id },
    });
    res.status(200).json({ message: "quiz found successfully", quiz });
  } catch (error) {
    console.log(error);
  }
};

export const quizUpdate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { course_id, title, max_attempts, quizId } = req.body;
    const userEligible = await User.findOne({ where: { id: userId } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const updatedQuiz = await Quiz.update(
        { title, max_attempts },
        { where: { id: quizId, course_id } }
      );
      res
        .status(200)
        .json({ message: "quiz updated successfully", updatedQuiz });
    } else {
      res.json({ message: "you are not elligible to update quiz" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const quizDelete = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const { userId } = req.body;
    const userEligible = await User.findOne({ where: { id: userId } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const deletedQuiz = await Quiz.destroy({
        where: { id: quizId },
      });
      res
        .status(200)
        .json({ message: "quiz deleted successfully", deletedQuiz });
    } else {
      res.json({ message: "you are not elligible to delete quiz" });
    }
  } catch (error) {
    console.log(error);
  }
};
