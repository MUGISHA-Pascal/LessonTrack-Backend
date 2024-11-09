import { Request, Response } from "express";
import User from "../models/User";
import Quiz from "../models/Quiz";
/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: Quiz management and administration
 */

/**
 * @swagger
 * /quiz/{userId}/add:
 *   post:
 *     summary: Add a new quiz (admin or sub_admin only)
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user adding the quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Quiz Title"
 *               max_attempts:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Quiz added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "quiz added successfully"
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
 *       403:
 *         description: Not eligible to add quiz
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /quiz:
 *   get:
 *     summary: Get quizzes by course ID
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Quizzes found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "quiz found successfully"
 *                 quiz:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /quiz/{userId}/update:
 *   put:
 *     summary: Update an existing quiz (admin or sub_admin only)
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user updating the quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Updated Quiz Title"
 *               max_attempts:
 *                 type: integer
 *                 example: 5
 *               quizId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "quiz updated successfully"
 *                 updatedQuiz:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: Not eligible to update quiz
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /quiz/{quizId}/delete:
 *   delete:
 *     summary: Delete a quiz (admin or sub_admin only)
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the quiz to be deleted
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
 *         description: Quiz deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "quiz deleted successfully"
 *                 deletedQuiz:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: Not eligible to delete quiz
 *       500:
 *         description: Server error
 */
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
