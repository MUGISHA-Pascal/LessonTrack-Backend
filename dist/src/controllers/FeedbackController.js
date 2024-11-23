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
exports.feedbackDelete = exports.feedbackUpdate = exports.getFeedbacks = exports.feedbackAdding = void 0;
const User_1 = __importDefault(require("../models/User"));
const Comments_1 = __importDefault(require("../models/Comments"));
const Feedback_1 = __importDefault(require("../models/Feedback"));
/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Feedback management for courses
 */
/**
 * @swagger
 * /feedbacks/add/{userId}:
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
const feedbackAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { user_id, course_id, feedback_text } = req.body;
        const userEligible = yield User_1.default.findOne({ where: { id: userId } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const feedback = yield Feedback_1.default.create({
                user_id,
                course_id,
                feedback_text,
            });
            res
                .status(200)
                .json({ message: "feedback added successfully", feedback });
        }
        else {
            res.json({ message: "you are not elligible to provide feedback" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.feedbackAdding = feedbackAdding;
/**
 * @swagger
 * /feedbacks/:
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
const getFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.body;
        const feedbacks = yield Feedback_1.default.findAll({
            where: { course_id: courseId },
        });
        res
            .status(200)
            .json({ message: "feedbacks found successfully", feedbacks });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getFeedbacks = getFeedbacks;
/**
 * @swagger
 * /feedbacks/update/{userId}:
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
const feedbackUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { feedback_id, courseId, feedback_text } = req.body;
        const userEligible = yield User_1.default.findOne({ where: { id: userId } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const updatedFeedback = yield Feedback_1.default.update({ feedback_text }, { where: { id: feedback_id, course_id: courseId, user_id: userId } });
            res
                .status(200)
                .json({ message: "feedback updated successfully", updatedFeedback });
        }
        else {
            res.json({ message: "you are not elligible to update feedback" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.feedbackUpdate = feedbackUpdate;
/**
 * @swagger
 * /feedbacks/delete/{feedbackId}:
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
const feedbackDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feedbackId } = req.params;
        const { userId } = req.body;
        const userEligible = yield User_1.default.findOne({ where: { id: userId } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const deletedComment = yield Comments_1.default.destroy({
                where: { id: feedbackId },
            });
            res
                .status(200)
                .json({ message: "feedback deleted successfully", deletedComment });
        }
        else {
            res.json({ message: "you are not elligible to delete feedback" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.feedbackDelete = feedbackDelete;
/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the feedback
 *           example: 1
 *         user_id:
 *           type: integer
 *           description: ID of the user who provided the feedback
 *           example: 1
 *         course_id:
 *           type: integer
 *           description: ID of the course the feedback is related to
 *           example: 1
 *         feedback_text:
 *           type: string
 *           description: The content of the feedback
 *           example: "Great course! Learned a lot."
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Feedback creation timestamp
 *           example: "2024-11-09T12:34:56Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Feedback last updated timestamp
 *           example: "2024-11-09T14:34:56Z"
 */
