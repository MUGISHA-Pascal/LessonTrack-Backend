import { Request, Response } from "express";
import User from "../models/User";
import Comment from "../models/Comments";
import Feedback from "../models/Feedback";

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Feedback management for courses
 */

/**
 * @swagger
 * /feedbacks/{userId}/add:
 *   post:
 *     summary: Add feedback for a course (admin or sub_admin only)
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user adding the feedback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               course_id:
 *                 type: integer
 *                 example: 1
 *               feedback_text:
 *                 type: string
 *                 example: "Great course!"
 *     responses:
 *       200:
 *         description: Feedback added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "feedback added successfully"
 *                 feedback:
 *                   $ref: '#/components/schemas/Feedback'
 *       403:
 *         description: Not eligible to provide feedback
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /feedbacks:
 *   get:
 *     summary: Retrieve feedbacks for a specific course
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Feedbacks found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "feedbacks found successfully"
 *                 feedbacks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedbacks not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /feedbacks/{userId}/update:
 *   put:
 *     summary: Update an existing feedback (admin or sub_admin only)
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user updating the feedback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedback_id:
 *                 type: integer
 *                 example: 1
 *               courseId:
 *                 type: integer
 *                 example: 1
 *               feedback_text:
 *                 type: string
 *                 example: "Updated feedback text"
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "feedback updated successfully"
 *                 updatedFeedback:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: Not eligible to update feedback
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /feedbacks/{feedbackId}/delete:
 *   delete:
 *     summary: Delete a feedback (admin or sub_admin only)
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the feedback to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "feedback deleted successfully"
 *                 deletedComment:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: Not eligible to delete feedback
 *       500:
 *         description: Server error
 */
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
