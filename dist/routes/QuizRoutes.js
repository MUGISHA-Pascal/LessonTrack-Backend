"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuizController_1 = require("../controllers/QuizController");
const QuizRoutes = (0, express_1.Router)();
QuizRoutes.post("/add_question/:userId", QuizController_1.quizAdding);
QuizRoutes.get("/get_questions", QuizController_1.getQuiz);
QuizRoutes.put("/update_question/:userId", QuizController_1.quizUpdate);
QuizRoutes.delete("/delete_question/:questionId", QuizController_1.quizDelete);
exports.default = QuizRoutes;
