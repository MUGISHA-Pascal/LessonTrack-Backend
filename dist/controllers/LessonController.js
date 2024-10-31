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
exports.lessonDelete = exports.lessonUpdate = exports.getLessons = exports.lessonAdding = void 0;
const Comments_1 = __importDefault(require("../models/Comments"));
const Lessons_1 = __importDefault(require("../models/Lessons"));
const lessonAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { course_id, comment_text } = req.body;
        const comment = yield Lessons_1.default.create({
            user_id,
            course_id,
            comment_text,
        });
        res.status(200).json({ message: "comment added successfully", comment });
    }
    catch (error) {
        console.log(error);
    }
});
exports.lessonAdding = lessonAdding;
const getLessons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getLessons = getLessons;
const lessonUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.lessonUpdate = lessonUpdate;
const lessonDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.lessonDelete = lessonDelete;
