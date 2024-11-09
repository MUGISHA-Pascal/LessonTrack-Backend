"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentDelete = exports.commentUpdate = exports.getComments = exports.commentAdding = void 0;
const Comments_1 = __importDefault(require("../models/Comments"));
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Managing comments on courses
 */
/**
 * @swagger
 * /comments/{userId}/add:
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
const commentAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { course_id, comment_text } = req.body;
        const comment = yield Comments_1.default.create({
            user_id: Number(userId),
            course_id,
            comment_text,
        });
        res.status(200).json({ message: "comment added successfully", comment });
    }
    catch (error) {
        console.log(error);
    }
});
exports.commentAdding = commentAdding;
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
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { courseId } = req.body;
        const comments = yield Comments_1.default.findAll({
            where: { user_id: userId, course_id: courseId },
        });
        res.status(200).json({ message: "comments found successfully", comments });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getComments = getComments;
/**
 * @swagger
 * /comments/{userId}/update:
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
const commentUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { comment_id, courseId, comment_text } = req.body;
        const updatedComment = yield Comments_1.default.update({ comment_text }, { where: { id: comment_id, course_id: courseId, user_id: userId } });
        res
            .status(200)
            .json({ message: "comment updated successfully", updatedComment });
    }
    catch (error) {
        console.log(error);
    }
});
exports.commentUpdate = commentUpdate;
/**
 * @swagger
 * /comments/{commentId}/delete:
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
const commentDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const deletedComment = yield Comments_1.default.destroy({ where: { id: commentId } });
        res
            .status(200)
            .json({ message: "comment deleted successfully", deletedComment });
    }
    catch (error) {
        console.log(error);
    }
});
exports.commentDelete = commentDelete;
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
