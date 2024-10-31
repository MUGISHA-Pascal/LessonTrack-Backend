"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LessonController_1 = require("../controllers/LessonController");
const LessonRouter = (0, express_1.Router)();
LessonRouter.post("/add_lesson/:userId", LessonController_1.lessonAdding);
LessonRouter.get("/get_lesson/:userId", LessonController_1.getLesson);
LessonRouter.put("/update_lesson/:userId", LessonController_1.lessonUpdate);
LessonRouter.delete("/delete_lesson/:lessonId", LessonController_1.lessonDelete);
exports.default = LessonRouter;