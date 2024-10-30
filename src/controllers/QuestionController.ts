import { Request, Response } from "express";
import User from "../models/User";
import Question from "../models/Questions";
export const questionAdding = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { quiz_id, question_text, correct_answer } = req.body;
    const userEligible = await User.findOne({ where: { id: userId } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const question = await Question.create({
        quiz_id,
        question_text,
        correct_answer,
      });
      res
        .status(200)
        .json({ message: "question added successfully", question });
    } else {
      res.json({ message: "you are not elligible to add question" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { quiz_id } = req.body;
    const questions = await Question.findAll({
      where: { quiz_id },
    });
    res
      .status(200)
      .json({ message: "Questions found successfully", questions });
  } catch (error) {
    console.log(error);
  }
};

export const questionUpdate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { quiz_id, question_text, correct_answer, questionId } = req.body;
    const userEligible = await User.findOne({ where: { id: userId } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const updatedQuestion = await Question.update(
        { question_text, correct_answer },
        { where: { id: questionId, quiz_id } }
      );
      res
        .status(200)
        .json({ message: "question updated successfully", updatedQuestion });
    } else {
      res.json({ message: "you are not elligible to update feedback" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const questionDelete = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    const { userId } = req.body;
    const userEligible = await User.findOne({ where: { id: userId } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const deletedQuestion = await Question.destroy({
        where: { id: questionId },
      });
      res
        .status(200)
        .json({ message: "question deleted successfully", deletedQuestion });
    } else {
      res.json({ message: "you are not elligible to delete question" });
    }
  } catch (error) {
    console.log(error);
  }
};
