"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const questionRoutes = (0, express_1.Router)();
questionRoutes.post("/add_question/:userId");
questionRoutes.get("/get_questions");
questionRoutes.put("/update_question/:userId");
questionRoutes.delete("/delete_question/:questionId");
exports.default = questionRoutes;
