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
exports.lessonDelete = exports.lessonUpdate = exports.getLesson = exports.lessonAdding = void 0;
const User_1 = __importDefault(require("../models/User"));
const Courses_1 = __importDefault(require("../models/Courses"));
const Lessons_1 = __importDefault(require("../models/Lessons"));
/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Lesson management within courses
 */
/**
 * @swagger
 * /lessons/{userId}/add:
 *   post:
 *     summary: Add a new lesson to a course (admin only)
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user adding the lesson
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Introduction to Node.js"
 *               course_id:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: "This is the first lesson of the Node.js course."
 *               media_url:
 *                 type: string
 *                 example: "http://example.com/media/lesson1.mp4"
 *     responses:
 *       200:
 *         description: Lesson created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "lesson created successfully"
 *                 lesson:
 *                   $ref: '#/components/schemas/Lesson'
 *       403:
 *         description: Not allowed to add lessons
 *       500:
 *         description: Server error
 */
const lessonAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { title, course_id, content, media_url } = req.body;
        const user = yield User_1.default.findOne({ where: { id: userId } });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const lesson = yield Lessons_1.default.create({
                title,
                course_id,
                content,
                media_url,
            });
            res.status(200).json({ message: "lesson created successfully", lesson });
        }
        else {
            res.json({ message: "you are not allowed adding lessons" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.lessonAdding = lessonAdding;
/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Get lessons by course title or list all courses
 *     tags: [Lessons]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Node.js Basics"
 *     responses:
 *       200:
 *         description: Course(s) retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "course found"
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
const getLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.title) {
            const { title } = req.body;
            const courseFound = yield Courses_1.default.findAll({ where: { title } });
            if (!courseFound) {
                res.json({ message: "course not found" });
            }
            res.status(200).json({ message: "course found", courses: courseFound });
        }
        else {
            const courses = yield Courses_1.default.findAll();
            res.status(200).json({ message: "all courses", courses });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.getLesson = getLesson;
/**
 * @swagger
 * /lessons/{userId}/update:
 *   put:
 *     summary: Update an existing lesson (admin only)
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user updating the lesson
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lessonId:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Advanced Node.js"
 *               content:
 *                 type: string
 *                 example: "Updated content for the lesson."
 *               course_id:
 *                 type: integer
 *                 example: 1
 *               media_url:
 *                 type: string
 *                 example: "http://example.com/media/lesson1_updated.mp4"
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "lesson updated successfully"
 *                 updatedLesson:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: Not allowed to update lessons
 *       500:
 *         description: Server error
 */
const lessonUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { lessonId, title, content, course_id, media_url } = req.body;
        const user = yield User_1.default.findOne({ where: { id: userId } });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const updatedLesson = yield Lessons_1.default.update({ title, content, media_url }, { where: { id: lessonId, course_id } });
            res
                .status(200)
                .json({ message: "lesson updated successfully", updatedLesson });
        }
        else {
            res.json({ message: "you are not allowed updating lessons" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.lessonUpdate = lessonUpdate;
/**
 * @swagger
 * /lessons/{userId}/delete:
 *   delete:
 *     summary: Delete a lesson from a course (admin only)
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user deleting the lesson
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lessonId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "lesson deleted successfully"
 *                 deletedLesson:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: Not allowed to delete lessons
 *       500:
 *         description: Server error
 */
const lessonDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { lessonId } = req.body;
        const user = yield User_1.default.findOne({ where: { id: userId } });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const deletedLesson = yield Lessons_1.default.destroy({ where: { id: lessonId } });
            res
                .status(200)
                .json({ message: "lesson deleted successfully", deletedLesson });
        }
        else {
            res.json({ message: "you are not allowed deleting lessons" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.lessonDelete = lessonDelete;
/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       required:
 *         - title
 *         - course_id
 *         - content
 *         - media_url
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the lesson
 *           example: 1
 *         title:
 *           type: string
 *           description: Title of the lesson
 *           example: "Introduction to Node.js"
 *         course_id:
 *           type: integer
 *           description: The ID of the course to which the lesson belongs
 *           example: 1
 *         content:
 *           type: string
 *           description: The content or description of the lesson
 *           example: "This is the first lesson of the Node.js course."
 *         media_url:
 *           type: string
 *           description: URL to the media file (e.g., video, audio) for the lesson
 *           example: "http://example.com/media/lesson1.mp4"
 */
