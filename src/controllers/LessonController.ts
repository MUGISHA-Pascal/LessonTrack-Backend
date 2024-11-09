import { Request, Response } from "express";
import User from "../models/User";
import Course from "../models/Courses";
import Lesson from "../models/Lessons";
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
export const lessonAdding = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { title, course_id, content, media_url } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const lesson = await Lesson.create({
        title,
        course_id,
        content,
        media_url,
      });
      res.status(200).json({ message: "lesson created successfully", lesson });
    } else {
      res.json({ message: "you are not allowed adding lessons" });
    }
  } catch (error) {
    console.log(error);
  }
};
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
export const getLesson = async (req: Request, res: Response) => {
  try {
    if (req.body.title) {
      const { title } = req.body;
      const courseFound = await Course.findAll({ where: { title } });
      if (!courseFound) {
        res.json({ message: "course not found" });
      }
      res.status(200).json({ message: "course found", courses: courseFound });
    } else {
      const courses = await Course.findAll();
      res.status(200).json({ message: "all courses", courses });
    }
  } catch (error) {
    console.log(error);
  }
};
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
export const lessonUpdate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { lessonId, title, content, course_id, media_url } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const updatedLesson = await Lesson.update(
        { title, content, media_url },
        { where: { id: lessonId, course_id } }
      );
      res
        .status(200)
        .json({ message: "lesson updated successfully", updatedLesson });
    } else {
      res.json({ message: "you are not allowed updating lessons" });
    }
  } catch (error) {
    console.log(error);
  }
};
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
export const lessonDelete = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { lessonId } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const deletedLesson = await Lesson.destroy({ where: { id: lessonId } });
      res
        .status(200)
        .json({ message: "lesson deleted successfully", deletedLesson });
    } else {
      res.json({ message: "you are not allowed deleting lessons" });
    }
  } catch (error) {
    console.log(error);
  }
};

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
