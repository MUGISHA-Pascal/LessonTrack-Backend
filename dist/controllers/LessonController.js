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
