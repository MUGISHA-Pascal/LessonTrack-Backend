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
exports.quizDelete = exports.quizUpdate = exports.getQuizes = exports.getQuiz = exports.quizAdding = void 0;
const User_1 = __importDefault(require("../models/User"));
const Quiz_1 = __importDefault(require("../models/Quiz"));
/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: Quiz management and administration
 */
/**
 * @swagger
 * /quiz/add/{userId}:
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
const quizAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id, title, max_attempts, description, type_of, owners } = req.body;
        const userEligible = yield User_1.default.findOne({ where: { id: owners } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const quiz = yield Quiz_1.default.create({
                owners,
                course_id,
                title,
                max_attempts,
                description,
                type_of,
            });
            res.status(200).json({ message: "quiz added successfully", quiz });
        }
        else {
            res.json({ message: "you are not elligible to add quiz" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.quizAdding = quizAdding;
/**
 * @swagger
 * /quiz/:
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
const getQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id } = req.params;
        const quizzes = yield Quiz_1.default.findAll({
            where: { owners: course_id },
        });
        res.status(200).json({ message: "quiz found successfully", quizzes });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getQuiz = getQuiz;
/**
 * @swagger
 * /quiz/update/{userId}:
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
const getQuizes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizzes = yield Quiz_1.default.findAll();
        res.status(200).json({ message: "quiz found successfully", quizzes });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getQuizes = getQuizes;
const quizUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { title, description, max_attempts, quizId } = req.body;
        console.log(title, description, max_attempts, quizId);
        const userEligible = yield User_1.default.findOne({ where: { id: userId } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const updatedQuiz = yield Quiz_1.default.update({ title, max_attempts, description }, { where: { id: quizId } });
            console.log("working");
            res
                .status(200)
                .json({ message: "quiz updated successfully", updatedQuiz });
            return;
        }
        else {
            res.json({ message: "you are not elligible to update quiz" });
            return;
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.quizUpdate = quizUpdate;
/**
 * @swagger
 * /quiz/delete/{quizId}:
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
const quizDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId, userId } = req.params;
        const userEligible = yield User_1.default.findOne({ where: { id: userId } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const deletedQuiz = yield Quiz_1.default.destroy({
                where: { id: quizId },
            });
            res
                .status(200)
                .json({ message: "quiz deleted successfully", deletedQuiz });
        }
        else {
            res.json({ message: "you are not elligible to delete quiz" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.quizDelete = quizDelete;
/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         course_id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Quiz Title"
 *         max_attempts:
 *           type: integer
 *           example: 3
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-09T00:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-09T00:00:00Z"
 */
// export const questionAnswersHandling = async (req: Request, res: Response) => {
//   const { answers, quizId } = req.body;
//   const quiz = await Quiz.findOne({ where: { id: quizId } });
//   let correctAnswers: string[] = [];
//   if (quiz) {
//     correctAnswers = quiz.answers;
//   }
//   if (!quiz) {
//     res.status(400).json({ error: "the quiz is not found" });
//   }
//   if (!Array.isArray(answers)) {
//     res.status(400).json({ error: "Answers must be an array." });
//   }
//   if (answers.length !== correctAnswers.length) {
//     res.status(400).json({
//       error: "Number of submitted answers does not match the expected length.",
//     });
//   }
//   let correctCount = 0;
//   answers.forEach((answer: string, index: number) => {
//     if (answer === correctAnswers[index]) {
//       correctCount++;
//     }
//   });
//   const averageScore = (correctCount / correctAnswers.length) * 100;
//   res.json({
//     message: "Answers processed successfully.",
//     totalQuestions: correctAnswers.length,
//     correctAnswers: correctCount,
//     averageScore: averageScore.toFixed(2),
//   });
// };
