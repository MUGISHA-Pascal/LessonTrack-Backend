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
exports.tripleRelation = exports.getCoursesByKeyword = exports.LessonAdding = exports.addingModule = exports.RatingRetrieval = exports.ratingUpdate = exports.CourseRetrievalByCategoryAndUserCount = exports.CourseRetrivalBasingOnUserCount = exports.userIncrement = exports.getQuiz = exports.BookMarkHandling = exports.courseTakenHandling = exports.courseimageRetrival = exports.courseprofileUploadController = exports.GetCourseByCategory = exports.fileRetrival = exports.CourseFileAdding = exports.courseDelete = exports.courseUpdate = exports.UsergetCourses = exports.getCourses = exports.courseAdding = void 0;
const User_1 = __importDefault(require("../models/User"));
const Courses_1 = __importDefault(require("../models/Courses"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CourseTaken_1 = __importDefault(require("../models/CourseTaken"));
const BookMark_1 = __importDefault(require("../models/BookMark"));
const module_1 = __importDefault(require("../models/module"));
const Lesson_1 = __importDefault(require("../models/Lesson"));
const sequelize_1 = require("sequelize");
const Quiz_1 = __importDefault(require("../models/Quiz"));
const Questions_1 = __importDefault(require("../models/Questions"));
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
const courseAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Calling course adding api");
    try {
        const { userId } = req.params;
        const { courseTitle, courseDescription, moduleNumber, content_type, category, } = req.body;
        console.log(req.body);
        const user = yield User_1.default.findOne({ where: { id: userId } });
        if ((user === null || user === void 0 ? void 0 : user.role) == "admin") {
            const course = yield Courses_1.default.create({
                module: moduleNumber,
                title: courseTitle,
                description: courseDescription,
                content_type,
                category,
                created_by: Number(userId),
            });
            res.status(200).json({ message: "course created successfully", course });
            return;
        }
        else {
            res.json({ message: "you are not allowed adding courses" });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.courseAdding = courseAdding;
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
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getCourses = getCourses;
const UsergetCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const courses = yield Courses_1.default.findAll({ where: { created_by: userId } });
        res.status(200).json({ message: "all courses", courses });
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports.UsergetCourses = UsergetCourses;
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
const courseUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { courseId, title, description, content_type, created_by, is_active, } = req.body;
        const user = yield User_1.default.findOne({ where: { id: userId } });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const updatedCourse = yield Courses_1.default.update({ title, description, content_type, created_by, is_active }, { where: { id: courseId } });
            res
                .status(200)
                .json({ message: "course updated successfully", updatedCourse });
        }
        else {
            res.json({ message: "you are not allowed updating courses" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.courseUpdate = courseUpdate;
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
const courseDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { courseId } = req.params;
        const user = yield User_1.default.findOne({ where: { id: userId } });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const CourseToDelete = yield Courses_1.default.findOne({ where: { id: courseId } });
            let filePath;
            if (CourseToDelete === null || CourseToDelete === void 0 ? void 0 : CourseToDelete.profile_image) {
                filePath = path_1.default.join(__dirname, "../../uploads/courses", CourseToDelete.profile_image);
            }
            if (filePath) {
                fs_1.default.rm(filePath, (error) => {
                    if (error) {
                        console.log(error);
                        res.status(500).json({ message: "error while deleting file " });
                        return;
                    }
                    else {
                        console.log("file successively deleted");
                        res.status(201).json({ message: "file successively deleted" });
                        return;
                    }
                });
            }
            const deletedCourse = yield Courses_1.default.destroy({ where: { id: courseId } });
            res
                .status(200)
                .json({ message: "course deleted successfully", deletedCourse });
            return;
        }
        else {
            res.json({ message: "you are not allowed deleting courses" });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.courseDelete = courseDelete;
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
const CourseFileAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, courseTitle, category, courseDescription } = req.body;
        console.log(userId);
        const user = yield User_1.default.findOne({ where: { id: userId } });
        console.log(user === null || user === void 0 ? void 0 : user.role);
        if (!user || user.role !== "admin") {
            res.status(403).json({ message: "You are not allowed to add courses" });
            return;
        }
        let imagename;
        if (!req.file) {
            imagename = "course.png";
            console.log("please include file");
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        imagename = req.file.filename;
        if (req.file) {
            yield Courses_1.default.create({
                // module: moduleNumber,
                title: courseTitle,
                description: courseDescription,
                // content_type: contentType,
                category,
                created_by: userId,
                profile_image: imagename,
            });
        }
        console.log("working");
        res.status(200).json({
            message: "Course uploaded successfully",
            // file: req.file,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.json({ message: error });
        return;
    }
});
exports.CourseFileAdding = CourseFileAdding;
const fileRetrival = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName } = req.params;
    const filePath = path_1.default.join(__dirname, "../../uploads/courses", fileName);
    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
        if (err) {
            res.status(404).json({ error: "file not found" });
            return;
        }
        res.sendFile(filePath);
        return;
    });
});
exports.fileRetrival = fileRetrival;
const GetCourseByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        const courses = yield Courses_1.default.findAll({ where: { category } });
        res.status(201).json({ courses });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
        return;
    }
});
exports.GetCourseByCategory = GetCourseByCategory;
const courseprofileUploadController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const course = yield Courses_1.default.findOne({ where: { id } });
        if (course) {
            if (req.file) {
                course.profile_image = req.file.path;
                course.save();
                res.json({ message: "course image uploaded successfully", course });
                return;
            }
            else {
                res.status(400).json({ message: "no course file uploaded" });
                return;
            }
        }
        else {
            res.status(404).json({ message: "course not found" });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
        return;
    }
});
exports.courseprofileUploadController = courseprofileUploadController;
const courseimageRetrival = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ImageName } = req.params;
    const filePath = path_1.default.join(__dirname, "../../uploads/courses", ImageName);
    console.log(ImageName);
    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
        if (err) {
            res.status(404).json({ error: "Image not found" });
            return;
        }
        res.sendFile(filePath);
        return;
    });
});
exports.courseimageRetrival = courseimageRetrival;
const courseTakenHandling = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { courseId } = req.body;
    if (!courseId) {
        res
            .status(400)
            .json({ error: "courseId is required in the request body." });
        return;
    }
    try {
        const courseTaken = yield CourseTaken_1.default.findOne({ where: { userId } });
        if (!courseTaken) {
            res.status(404).json({
                error: "User not found or no courses associated with this user.",
            });
            return;
        }
        const updatedCourseIds = Array.from(new Set([...((courseTaken === null || courseTaken === void 0 ? void 0 : courseTaken.courseIds) || []), courseId]));
        yield (courseTaken === null || courseTaken === void 0 ? void 0 : courseTaken.update({ courseIds: updatedCourseIds }));
        res.status(200).json({
            message: "Course ID added successfully.",
            courseIds: updatedCourseIds,
        });
        return;
    }
    catch (error) {
        console.error("Error adding course ID:", error);
        res
            .status(500)
            .json({ error: "An error occurred while adding the course ID." });
        return;
    }
});
exports.courseTakenHandling = courseTakenHandling;
const BookMarkHandling = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { courseId } = req.body;
    if (!courseId) {
        res
            .status(400)
            .json({ error: "courseId is required in the request body." });
        return;
    }
    try {
        let bookmark = yield BookMark_1.default.findOne({ where: { userId } });
        if (!bookmark) {
            bookmark = yield BookMark_1.default.create({
                userId: Number(userId),
                courseIds: [courseId],
            });
        }
        else {
            const updatedCourseIds = Array.from(new Set([...(bookmark.courseIds || []), courseId]));
            yield bookmark.update({ courseIds: updatedCourseIds });
        }
        res.status(200).json({
            message: "Course ID bookmarked successfully.",
            bookmark,
        });
        return;
    }
    catch (error) {
        console.error("Error adding course to bookmarks:", error);
        res.status(500).json({
            error: "An error occurred while adding the course to bookmarks.",
        });
        return;
    }
});
exports.BookMarkHandling = BookMarkHandling;
const getQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ress = yield module_1.default.findByPk(id);
        if (ress) {
            res.status(200).json({ ress });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.getQuiz = getQuiz;
const userIncrement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    try {
        const course = yield Courses_1.default.findByPk(courseId);
        if (!course) {
            res.status(404).json({ error: "Course not found." });
            return;
        }
        const newUserCount = (course.userCount || 0) + 1;
        yield course.update({ userCount: newUserCount });
        res.status(200).json({
            message: "User count incremented successfully.",
            course,
        });
        return;
    }
    catch (error) {
        console.error("Error incrementing user count:", error);
        res
            .status(500)
            .json({ error: "An error occurred while incrementing the user count." });
        return;
    }
});
exports.userIncrement = userIncrement;
const CourseRetrivalBasingOnUserCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Courses_1.default.findAll({
            order: [["userCount", "DESC"]],
        });
        res.status(200).json({
            message: "Courses retrieved successfully.",
            courses,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        res
            .status(500)
            .json({ error: "An error occurred while retrieving courses." });
        return;
    }
});
exports.CourseRetrivalBasingOnUserCount = CourseRetrivalBasingOnUserCount;
const CourseRetrievalByCategoryAndUserCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        if (!category) {
            res.status(400).json({
                error: "Category is required to filter courses.",
            });
            return;
        }
        const courses = yield Courses_1.default.findAll({
            where: { category },
            order: [["userCount", "DESC"]],
        });
        if (courses.length === 0) {
            res.status(404).json({
                message: `No courses found for category: ${category}`,
            });
            return;
        }
        res.status(200).json({
            message: `Courses retrieved successfully for category: ${category}`,
            courses,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({
            error: "An error occurred while retrieving courses.",
        });
        return;
    }
});
exports.CourseRetrievalByCategoryAndUserCount = CourseRetrievalByCategoryAndUserCount;
const ratingUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { rating } = req.body;
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
        res
            .status(400)
            .json({ message: "Rating must be a number between 1 and 5." });
        return;
    }
    try {
        const course = yield Courses_1.default.findByPk(id);
        if (!course) {
            res.status(404).json({ message: "Course not found." });
            return;
        }
        const currentRatingCount = course.ratingCount || 0;
        const currentRatingAverage = course.ratingAverage || 0;
        const newRatingCount = currentRatingCount + 1;
        const newRatingAverage = (currentRatingAverage * currentRatingCount + rating) / newRatingCount;
        course.ratingCount = newRatingCount;
        course.ratingAverage = newRatingAverage;
        yield course.save();
        res.status(200).json({
            message: "Rating updated successfully.",
            ratingAverage: course.ratingAverage,
            ratingCount: course.ratingCount,
        });
        return;
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "An error occurred while rating the course." });
        return;
    }
});
exports.ratingUpdate = ratingUpdate;
const RatingRetrieval = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const course = yield Courses_1.default.findByPk(id);
        if (!course) {
            res.status(404).json({ message: "Course not found." });
            return;
        }
        res.status(200).json({
            ratingAverage: course.ratingAverage || 0,
            ratingCount: course.ratingCount || 0,
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while fetching the course ratings.",
        });
        return;
    }
});
exports.RatingRetrieval = RatingRetrieval;
const addingModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { module, courseId } = req.body;
        const courseChecking = yield Courses_1.default.findOne({ where: { id: courseId } });
        if (!courseChecking) {
            res.status(404).json({ message: "course not found" });
            return;
        }
        const savedModule = yield module_1.default.create({ module, courseId });
        if (!savedModule) {
            res.status(500).json({ message: "the module is not saved" });
            return;
        }
        res.status(201).json({ savedModule, message: "module is saved" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "an error occured when adding the module",
        });
        return;
    }
});
exports.addingModule = addingModule;
const LessonAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //lessons must be an array of sub lessons for a given module
        const { moduleId, lessons } = req.body;
        const moduleCheck = yield module_1.default.findOne({ where: { id: moduleId } });
        if (!moduleCheck) {
            res.status(404).json({ message: "module not found" });
            return;
        }
        yield Promise.all(lessons.map((lesson) => Lesson_1.default.create({
            image: lesson.image,
            content: lesson.content,
            moduleId,
        })));
        res.status(201).json({ message: "lessons added successively" });
        return;
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "error while saving lessons for a module" });
        return;
    }
});
exports.LessonAdding = LessonAdding;
const getCoursesByKeyword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.query;
        const courses = yield Courses_1.default.findAll({
            where: {
                title: {
                    [sequelize_1.Op.iLike]: `%${text}%`, // Wildcard search
                },
            },
        });
        if (courses.length > 0) {
            res.status(200).json({ courses });
            return;
        }
        else {
            res.status(200).send({ courses });
            return;
        }
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred" });
        return;
    }
});
exports.getCoursesByKeyword = getCoursesByKeyword;
const tripleRelation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        let courses = [];
        let quizzes = [];
        let questions = [];
        const CoursesRetr = yield Courses_1.default.findAll({
            where: { created_by: userId },
        });
        courses = CoursesRetr;
        for (const course of courses) {
            const QuizRetr = yield Quiz_1.default.findAll({
                where: { course_id: course.id },
            });
            for (const quiz of QuizRetr) {
                quizzes.push(quiz);
                const QuestRetr = yield Questions_1.default.findAll({
                    where: { quiz_id: quiz.id },
                });
                questions.push(...QuestRetr);
            }
        }
        res.status(200).json({ courses, quizzes, questions });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.tripleRelation = tripleRelation;
/**
 * @openapi
 * /courses/add_file:
 *   post:
 *     summary: Upload a new course
 *     description: Admins can upload a new course, including title, description, content type, and category, along with a course file.
 *     tags:
 *       - Course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user uploading the course.
 *               courseTitle:
 *                 type: string
 *                 description: The title of the course.
 *               category:
 *                 type: string
 *                 description: The category of the course.
 *               courseDescription:
 *                 type: string
 *                 description: The description of the course.
 *               contentType:
 *                 type: string
 *                 description: The content type (e.g., video, pdf).
 *     responses:
 *       200:
 *         description: Course uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "course uploaded successfully"
 *                 file:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *       400:
 *         description: No file uploaded or invalid data
 *       403:
 *         description: Unauthorized user
 */
/**
 * @openapi
 * /courses/file/{fileName}:
 *   get:
 *     summary: Retrieve a specific course file
 *     description: Allows users to retrieve a course file by providing the file name.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         description: The name of the course file to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The course file was found and is being returned.
 *       404:
 *         description: File not found
 */
/**
 * @openapi
 * /courses/get_courses/{category}:
 *   get:
 *     summary: Get courses by category
 *     description: Retrieves a list of courses filtered by category.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: The category of the courses to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of courses in the specified category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Course Title"
 *                       description:
 *                         type: string
 *                         example: "Course Description"
 *                       content_type:
 *                         type: string
 *                         example: "video"
 *                       category:
 *                         type: string
 *                         example: "Programming"
 *       404:
 *         description: No courses found in the specified category
 *       500:
 *         description: Server error
 */
/**
 * @openapi
 * /courses/upload_profile/{id}:
 *   put:
 *     summary: Upload a profile image for a course
 *     description: Allows admins to upload a profile image for an existing course by course ID.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course to upload a profile image for.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course profile image uploaded successfully.
 *       400:
 *         description: No image file uploaded
 *       404:
 *         description: Course not found
 */
/**
 * @openapi
 * /courses/image/{ImageName}:
 *   get:
 *     summary: Retrieve a course image
 *     description: Allows users to retrieve a course profile image by providing the image name.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: path
 *         name: ImageName
 *         required: true
 *         description: The name of the course image to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The course image was found and is being returned.
 *       404:
 *         description: Image not found
 */
