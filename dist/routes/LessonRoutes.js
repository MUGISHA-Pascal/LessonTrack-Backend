"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LessonRouter = (0, express_1.Router)();
LessonRouter.post("/add_lesson/:userId");
LessonRouter.get("/get_lesson/:userId");
LessonRouter.put("/update_lesson/:userId");
LessonRouter.delete("/delete_lesson/:lessonId");
exports.default = LessonRouter;
