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
exports.quizDelete = exports.quizUpdate = exports.getQuiz = exports.quizAdding = void 0;
const User_1 = __importDefault(require("../models/User"));
const Quiz_1 = __importDefault(require("../models/Quiz"));
const quizAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { course_id, title, max_attempts } = req.body;
        const userEligible = yield User_1.default.findOne({ where: { id: userId } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const quiz = yield Quiz_1.default.create({
                course_id,
                title,
                max_attempts,
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
const getQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id } = req.body;
        const quiz = yield Quiz_1.default.findAll({
            where: { course_id },
        });
        res.status(200).json({ message: "quiz found successfully", quiz });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getQuiz = getQuiz;
const quizUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { course_id, title, max_attempts, quizId } = req.body;
        const userEligible = yield User_1.default.findOne({ where: { id: userId } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const updatedQuiz = yield Quiz_1.default.update({ title, max_attempts }, { where: { id: quizId, course_id } });
            res
                .status(200)
                .json({ message: "quiz updated successfully", updatedQuiz });
        }
        else {
            res.json({ message: "you are not elligible to update quiz" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.quizUpdate = quizUpdate;
const quizDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.params;
        const { userId } = req.body;
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
