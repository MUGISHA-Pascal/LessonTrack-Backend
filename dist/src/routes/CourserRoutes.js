"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CourseController_1 = require("../controllers/CourseController");
const CourseUpload_1 = __importDefault(require("../middlewares/CourseUpload"));
const CourseRoutes = (0, express_1.Router)();
CourseRoutes.post("/add/:userId", CourseController_1.courseAdding);
CourseRoutes.get("/", CourseController_1.getCourses);
CourseRoutes.put("/update/:userId", CourseController_1.courseUpdate);
CourseRoutes.delete("/delete/:userId", CourseController_1.courseDelete);
CourseRoutes.get("/file/:fileName", CourseController_1.fileRetrival);
CourseRoutes.post("/add_file", CourseUpload_1.default.single("file"), CourseController_1.CourseFileAdding);
CourseRoutes.get("/get_courses/:category", CourseController_1.GetCourseByCategory);
exports.default = CourseRoutes;
