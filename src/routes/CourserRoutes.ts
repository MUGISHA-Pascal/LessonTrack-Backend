import { Router } from "express";
import {
  courseAdding,
  courseDelete,
  courseUpdate,
  getCourses,
} from "../controllers/CourseController";

const CourseRoutes = Router();
CourseRoutes.post("/add/:userId", courseAdding);
CourseRoutes.get("/", getCourses);
CourseRoutes.put("/update/:userId", courseUpdate);
CourseRoutes.delete("/delete/:userId", courseDelete);
export default CourseRoutes;
