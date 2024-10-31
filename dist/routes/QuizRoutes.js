"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuizRoutes = (0, express_1.Router)();
QuizRoutes.post("/add_question/:userId");
QuizRoutes.get("/get_questions");
QuizRoutes.put("/update_question/:userId");
QuizRoutes.delete("/delete_question/:questionId");
exports.default = QuizRoutes;
