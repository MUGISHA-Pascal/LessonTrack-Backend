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
exports.courseDelete = exports.courseUpdate = exports.getCourses = exports.courseAdding = void 0;
const User_1 = __importDefault(require("../models/User"));
const Courses_1 = __importDefault(require("../models/Courses"));
const courseAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { title, description, content_type, is_active } = req.body;
        const user = yield User_1.default.findOne({ where: { id: userId } });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const course = yield Courses_1.default.create({
                title,
                description,
                content_type,
                created_by: Number(userId),
                is_active,
            });
            res.status(200).json({ message: "course created successfully", course });
        }
        else {
            res.json({ message: "you are not allowed adding courses" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.courseAdding = courseAdding;
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
const courseDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { courseId } = req.body;
        const user = yield User_1.default.findOne({ where: { id: userId } });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const deletedCourse = yield Courses_1.default.destroy({ where: { id: courseId } });
            res
                .status(200)
                .json({ message: "course deleted successfully", deletedCourse });
        }
        else {
            res.json({ message: "you are not allowed deleting courses" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.courseDelete = courseDelete;
