"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LessonController_1 = require("../controllers/LessonController");
const LessonRouter = (0, express_1.Router)();
LessonRouter.post("/add/:userId", LessonController_1.lessonAdding);
LessonRouter.get("/:userId", LessonController_1.getLesson);
LessonRouter.put("/update/:userId", LessonController_1.lessonUpdate);
LessonRouter.delete("/delete/:userId", LessonController_1.lessonDelete);
exports.default = LessonRouter;
