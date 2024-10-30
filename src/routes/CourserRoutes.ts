import { Router } from "express";
import { courseAdding } from "../controllers/CourseController";

const CourseRoutes = Router();
CourseRoutes.post("/add_course/:userId", courseAdding);

export default CourseRoutes;
