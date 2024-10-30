"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CourseController_1 = require("../controllers/CourseController");
const CourseRoutes = (0, express_1.Router)();
CourseRoutes.post("/add_course/:userId", CourseController_1.courseAdding);
CourseRoutes.get("/get_courses/", CourseController_1.getCourses);
CourseRoutes.put("/update_courses/:userId", CourseController_1.courseUpdate);
exports.default = CourseRoutes;
