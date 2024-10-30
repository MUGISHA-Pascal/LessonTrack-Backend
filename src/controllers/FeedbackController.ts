import { Request, Response } from "express";
import User from "../models/User";
import Comment from "../models/Comments";
import Feedback from "../models/Feedback";
export const feedbackAdding = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { user_id, course_id, feedback_text } = req.body;
    const userEligible = await User.findOne({ where: { id: userId } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const feedback = await Feedback.create({
        user_id,
        course_id,
        feedback_text,
      });
      res
        .status(200)
        .json({ message: "feedback added successfully", feedback });
    } else {
      res.json({ message: "you are not elligible to provide feedback" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const feedbacks = await Feedback.findAll({
      where: { course_id: courseId },
    });
    res
      .status(200)
      .json({ message: "feedbacks found successfully", feedbacks });
  } catch (error) {
    console.log(error);
  }
};

export const feedbackUpdate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { feedback_id, courseId, feedback_text } = req.body;
    const userEligible = await User.findOne({ where: { id: userId } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const updatedFeedback = await Feedback.update(
        { feedback_text },
        { where: { id: feedback_id, course_id: courseId, user_id: userId } }
      );
      res
        .status(200)
        .json({ message: "feedback updated successfully", updatedFeedback });
    } else {
      res.json({ message: "you are not elligible to update feedback" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const feedbackDelete = async (req: Request, res: Response) => {
  try {
    const { feedbackId } = req.params;
    const { userId } = req.body;
    const userEligible = await User.findOne({ where: { id: userId } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const deletedComment = await Comment.destroy({
        where: { id: feedbackId },
      });
      res
        .status(200)
        .json({ message: "feedback deleted successfully", deletedComment });
    } else {
      res.json({ message: "you are not elligible to delete feedback" });
    }
  } catch (error) {
    console.log(error);
  }
};
