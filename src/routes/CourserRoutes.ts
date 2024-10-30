import { Router } from "express";
import {
  courseAdding,
  courseUpdate,
  getCourses,
} from "../controllers/CourseController";

const CourseRoutes = Router();
CourseRoutes.post("/add_course/:userId", courseAdding);
CourseRoutes.get("/get_courses/", getCourses);
CourseRoutes.put("/update_courses/:userId", courseUpdate);
export default CourseRoutes;
