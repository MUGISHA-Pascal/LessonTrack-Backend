import { Request, Response } from "express";
import User from "../models/User";
import Course from "../models/Courses";
import fs from "fs";
import path from "path";
/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management for the platform
 */

/**
 * @swagger
 * /courses/add/{userId}:
 *   post:
 *     summary: Add a new course (admin only)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user adding the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Advanced JavaScript"
 *               description:
 *                 type: string
 *                 example: "An in-depth course on modern JavaScript techniques."
 *               content_type:
 *                 type: string
 *                 example: "video"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "course created successfully"
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       403:
 *         description: User is not allowed to add courses
 *       500:
 *         description: Server error
 */
export const courseAdding = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { title, description, content_type, is_active } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const course = await Course.create({
        title,
        description,
        content_type,
        created_by: Number(userId),
        is_active,
      });
      res.status(200).json({ message: "course created successfully", course });
    } else {
      res.json({ message: "you are not allowed adding courses" });
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * @swagger
 * /courses/:
 *   get:
 *     summary: Get a list of all courses or search by title
 *     tags: [Courses]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "JavaScript"
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "all courses"
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       404:
 *         description: No courses found matching the search criteria
 *       500:
 *         description: Server error
 */
export const getCourses = async (req: Request, res: Response) => {
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
 * /courses/update/{userId}:
 *   put:
 *     summary: Update course details (admin only)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user updating the course
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
 *               title:
 *                 type: string
 *                 example: "Advanced JavaScript"
 *               description:
 *                 type: string
 *                 example: "Updated in-depth course content on JavaScript."
 *               content_type:
 *                 type: string
 *                 example: "video"
 *               created_by:
 *                 type: integer
 *                 example: 1
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "course updated successfully"
 *                 updatedCourse:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: User is not allowed to update courses
 *       500:
 *         description: Server error
 */
export const courseUpdate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const {
      courseId,
      title,
      description,
      content_type,
      created_by,
      is_active,
    } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const updatedCourse = await Course.update(
        { title, description, content_type, created_by, is_active },
        { where: { id: courseId } }
      );
      res
        .status(200)
        .json({ message: "course updated successfully", updatedCourse });
    } else {
      res.json({ message: "you are not allowed updating courses" });
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * @swagger
 * /courses/delete/{feedbackId}:
 *   delete:
 *     summary: Delete a course (admin only)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the course to delete
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
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "course deleted successfully"
 *                 deletedCourse:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: User is not allowed to delete courses
 *       500:
 *         description: Server error
 */
export const courseDelete = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const deletedCourse = await Course.destroy({ where: { id: courseId } });
      res
        .status(200)
        .json({ message: "course deleted successfully", deletedCourse });
    } else {
      res.json({ message: "you are not allowed deleting courses" });
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - content_type
 *         - is_active
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the course
 *           example: 1
 *         title:
 *           type: string
 *           description: The title of the course
 *           example: "Advanced JavaScript"
 *         description:
 *           type: string
 *           description: A detailed description of the course
 *           example: "An in-depth course on modern JavaScript techniques."
 *         content_type:
 *           type: string
 *           description: The type of course content (e.g., video, text, etc.)
 *           example: "video"
 *         created_by:
 *           type: integer
 *           description: The ID of the user who created the course
 *           example: 1
 *         is_active:
 *           type: boolean
 *           description: The status of the course (whether it's active or not)
 *           example: true
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the user
 *           example: 1
 *         role:
 *           type: string
 *           description: The role of the user (e.g., "admin", "student")
 *           example: "admin"
 */
export const CourseFileAdding = async (req: Request, res: Response) => {
  try {
    const { userId, courseTitle, courseDescription, contentType } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
      }
      await Course.create({
        title: courseTitle,
        description: courseDescription,
        content_type: contentType,
        created_by: userId,
        file: req.file?.filename,
      });
      res.status(200).json({
        message: "course uploaded successfully",
        file: req.file,
      });
    } else {
      res.json({ message: "you are not allowed adding courses" });
    }
  } catch (error) {
    res.json({ message: error });
  }
};
export const fileRetrival = async (req: Request, res: Response) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, "../../uploads/courses", fileName);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json({ error: "file not found" });
    }
    res.sendFile(filePath);
  });
};
