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
exports.quizDelete = exports.update = exports.saveQuiz = exports.quizUpdate = exports.getQuizesStart = exports.getQuizesLast = exports.getQuizesCat = exports.getYourDoneQuiz = exports.getQuizesExam = exports.getQuizes = exports.getQuizFetch = exports.getQuiz = exports.getCategory = exports.quizAdding = void 0;
const User_1 = __importDefault(require("../models/User"));
const Quiz_1 = __importDefault(require("../models/Quiz"));
const Questions_1 = __importDefault(require("../models/Questions"));
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const Taken_1 = __importDefault(require("../models/Taken"));
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
        const { course_id, title, max_attempts, description, type_of, owners, category } = req.body;
        if (type_of === "quiz") {
            const QuizFound = yield Quiz_1.default.findOne({
                where: { course_id, type_of: "quiz" },
            });
            if (QuizFound) {
                res
                    .status(405)
                    .json({
                    message: "you are allowed to only add one quiz for a course",
                });
                return;
            }
        }
        if (type_of === "exam") {
            const ExamFound = yield Quiz_1.default.findOne({
                where: { course_id, type_of: "exam" },
            });
            if (ExamFound) {
                res
                    .status(405)
                    .json({
                    message: "you are allowed to only add one exam for a course",
                });
                return;
            }
        }
        const userEligible = yield User_1.default.findOne({ where: { id: owners } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const quiz = yield Quiz_1.default.create({
                owners,
                course_id,
                title,
                max_attempts,
                description,
                type_of,
                categoryName: category
            });
            res.status(200).json({ message: "quiz added successfully", quiz });
        }
        else {
            res.status(404).json({ message: "you are not elligible to add quiz" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.quizAdding = quizAdding;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch grouped courses by category
        const groupedCourses = yield Quiz_1.default.findAll({
            attributes: ['categoryName'] // Fixed typo here
        });
        if (!groupedCourses || groupedCourses.length === 0) {
            res.status(404).json({ message: "No courses found" });
            return;
        }
        res.status(200).json({
            message: "Courses grouped by category",
            groupedCourses,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching courses." });
    }
});
exports.getCategory = getCategory;
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
const getQuizFetch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getQuizFetch = getQuizFetch;
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
        const quizzes = yield Quiz_1.default.findAll({
            include: [
                {
                    model: Questions_1.default,
                    attributes: ['question', 'options'], // Optional attributes
                },
            ],
        });
        res.status(200).json({ message: "Quizzes found successfully", quizzes });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching quizzes" });
    }
});
exports.getQuizes = getQuizes;
const getQuizesExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizzes = yield Quiz_1.default.findAll({
            include: [
                {
                    model: Questions_1.default,
                    attributes: ['question', 'options'], // Optional attributes
                },
            ],
            where: {
                type_of: { [sequelize_2.Op.iLike]: "exam" }
            }
        });
        res.status(200).json({ message: "Quizzes found successfullys", quizzes });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching quizzes" });
    }
});
exports.getQuizesExam = getQuizesExam;
const getYourDoneQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid } = req.params; // Assuming userid is passed as a parameter
    try {
        // Fetch all entries from the Taken table for the given userid
        const takenEntries = yield Taken_1.default.findAll({
            where: { userid },
            attributes: ['id', 'quiz', 'marks', 'status', 'userid'], // Select all attributes
            raw: true, // Fetch raw data for easier processing
        });
        // Extract quiz IDs from the Taken table
        const quizIds = takenEntries.map((entry) => entry.quiz);
        if (quizIds.length === 0) {
            res.status(404).json({ message: 'No quizzes found for the given user', data: [] });
            return;
        }
        const quizzes = yield Quiz_1.default.findAll({
            include: [
                {
                    model: Questions_1.default,
                    attributes: ['id', 'question', 'options'],
                },
            ],
            where: {
                id: {
                    [sequelize_2.Op.in]: quizIds,
                },
            },
            raw: false,
        });
        const result = takenEntries.map((entry) => {
            const quizDetails = quizzes.find((quiz) => quiz.id === entry.quiz);
            return Object.assign(Object.assign({}, entry), { quizDetails: quizDetails || null });
        });
        res.status(200).json({ message: 'Quizzes found successfully', data: result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching quizzes', error: error });
    }
});
exports.getYourDoneQuiz = getYourDoneQuiz;
const getQuizesCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cat } = req.params;
    try {
        const quizzes = yield Quiz_1.default.findAll({
            include: [
                {
                    model: Questions_1.default,
                    attributes: ['question', 'options'], // Optional attributes
                },
            ],
            where: {
                categoryName: cat
            }
        });
        res.status(200).json({ message: "quiz found successfully", quizzes });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getQuizesCat = getQuizesCat;
const getQuizesLast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const quizzes = yield Quiz_1.default.findAll({
            include: [
                {
                    model: Questions_1.default,
                    attributes: ['question', 'options', "id"],
                },
            ],
            where: {
                course_id: id
            },
            limit: 1,
            order: [sequelize_1.Sequelize.literal('RANDOM()')],
        });
        res.status(200).json({ message: "quiz found successfully", quizzes });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getQuizesLast = getQuizesLast;
const getQuizesStart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const quizzes = yield Quiz_1.default.findAll({
            include: [
                {
                    model: Questions_1.default,
                    attributes: ['question', 'options', "id"],
                },
            ],
            where: {
                id: id
            },
            limit: 1,
        });
        res.status(200).json({ message: "quiz found successfully", quizzes });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getQuizesStart = getQuizesStart;
const quizUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { title, description, max_attempts, quizId } = req.body;
        console.log(title, description, max_attempts, quizId);
        const userEligible = yield User_1.default.findOne({ where: { id: userId } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const updatedQuiz = yield Quiz_1.default.update({ title, max_attempts, description }, { where: { id: quizId } });
            // console.log("working");
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
const saveQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid, quiz, marks, status } = req.body;
    try {
        const save = yield Taken_1.default.create({ userid, quiz, marks, status });
        res.status(200).json({ message: "Quiz saved", save });
        console.log("quiz was saved successfully");
    }
    catch (error) {
        console.error("Error saving quiz:", error);
        res.status(500).json({ message: "An error occurred", error });
    }
});
exports.saveQuiz = saveQuiz;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid, quiz, marks, status } = req.body;
    try {
        const save = yield Taken_1.default.update({
            marks,
            status,
        }, {
            where: {
                userid,
                quiz
            }
        });
        res.status(200).json({ message: "Quiz saved", save });
        console.log("quiz was saved successfully");
    }
    catch (error) {
        console.error("Error saving quiz:", error);
        res.status(500).json({ message: "An error occurred", error });
    }
});
exports.update = update;
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
