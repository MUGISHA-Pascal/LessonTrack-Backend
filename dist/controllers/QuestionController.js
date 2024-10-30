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
exports.questionDelete = exports.questionUpdate = exports.getQuestions = exports.questionAdding = void 0;
const User_1 = __importDefault(require("../models/User"));
const Questions_1 = __importDefault(require("../models/Questions"));
const questionAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { quiz_id, question_text, correct_answer } = req.body;
        const userEligible = yield User_1.default.findOne({ where: { id: userId } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const question = yield Questions_1.default.create({
                quiz_id,
                question_text,
                correct_answer,
            });
            res
                .status(200)
                .json({ message: "question added successfully", question });
        }
        else {
            res.json({ message: "you are not elligible to add question" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.questionAdding = questionAdding;
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quiz_id } = req.body;
        const questions = yield Questions_1.default.findAll({
            where: { quiz_id },
        });
        res
            .status(200)
            .json({ message: "Questions found successfully", questions });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getQuestions = getQuestions;
const questionUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { quiz_id, question_text, correct_answer, questionId } = req.body;
        const userEligible = yield User_1.default.findOne({ where: { id: userId } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const updatedQuestion = yield Questions_1.default.update({ question_text, correct_answer }, { where: { id: questionId, quiz_id } });
            res
                .status(200)
                .json({ message: "question updated successfully", updatedQuestion });
        }
        else {
            res.json({ message: "you are not elligible to update feedback" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.questionUpdate = questionUpdate;
const questionDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId } = req.params;
        const { userId } = req.body;
        const userEligible = yield User_1.default.findOne({ where: { id: userId } });
        if ((userEligible === null || userEligible === void 0 ? void 0 : userEligible.role) === "sub_admin" || "admin") {
            const deletedQuestion = yield Questions_1.default.destroy({
                where: { id: questionId },
            });
            res
                .status(200)
                .json({ message: "question deleted successfully", deletedQuestion });
        }
        else {
            res.json({ message: "you are not elligible to delete question" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.questionDelete = questionDelete;
