import { Request, Response } from "express";
import User from "../models/User";
import Comment from "../models/Comments";
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Managing comments on courses
 */

/**
 * @swagger
 * /comments/add/{userId}:
 *   post:
 *     summary: Add a comment on a course
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user adding the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 101
 *               comment_text:
 *                 type: string
 *                 example: "Great course, very informative!"
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "comment added successfully"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error
 */
export const commentAdding = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { course_id, comment_text, dates } = req.body;

    const comment = await Comment.create({
      user_id: Number(userId),
      course_id,
      comment_text,
      dates
    });
    res.status(200).json({ message: "comment added successfully", comment });
  } catch (error) {
    console.log(error);
  }
};

/**
 * @swagger
 * /comments/{userId}:
 *   get:
 *     summary: Get comments by a user on a specific course
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user fetching comments
 *       - in: body
 *         name: courseId
 *         description: Course ID to fetch comments for
 *         schema:
 *           type: object
 *           properties:
 *             courseId:
 *               type: integer
 *               example: 101
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "comments found successfully"
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       404:
 *         description: No comments found for the given criteria
 *       500:
 *         description: Server error
 */
export const getComments = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    // const { courseId } = req.body;
    const comments = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'profilepicture'],  // Optional attributes
        },
      ],
      where: {course_id: courseId },
    });
    res.status(200).json({ message: "comments found successfully", comments });
  } catch (error) {
    console.log(error);
  }
};
/**
 * @swagger
 * /comments/update/{userId}:
 *   put:
 *     summary: Update a comment (user-specific)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user updating the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: integer
 *                 example: 5
 *               courseId:
 *                 type: integer
 *                 example: 101
 *               comment_text:
 *                 type: string
 *                 example: "Updated my thoughts, really great course!"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "comment updated successfully"
 *                 updatedComment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input or unauthorized user
 *       500:
 *         description: Server error
 */
export const commentUpdate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { comment_id, courseId, comment_text } = req.body;

    const updatedComment = await Comment.update(
      { comment_text },
      { where: { id: comment_id, course_id: courseId, user_id: userId } }
    );
    res
      .status(200)
      .json({ message: "comment updated successfully", updatedComment });
  } catch (error) {
    console.log(error);
  }
};
/**
 * @swagger
 * /comments/delete/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "comment deleted successfully"
 *                 deletedComment:
 *                   type: integer
 *                   example: 5
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
export const commentDelete = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await Comment.destroy({ where: { id: commentId } });
    res
      .status(200)
      .json({ message: "comment deleted successfully", deletedComment });
  } catch (error) {
    console.log(error);
  }
};
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         course_id:
 *           type: integer
 *           example: 101
 *         comment_text:
 *           type: string
 *           example: "Great course, very informative!"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-11-09T10:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-11-09T12:00:00Z"
 */
