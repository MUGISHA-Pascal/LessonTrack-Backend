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
