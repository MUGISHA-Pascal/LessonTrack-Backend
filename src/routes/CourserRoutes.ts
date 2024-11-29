import { Router } from "express";
import {
  courseAdding,
  courseDelete,
  CourseFileAdding,
  courseUpdate,
  fileRetrival,
  getCourses,
} from "../controllers/CourseController";
import CourseUpload from "../middlewares/CourseUpload";

const CourseRoutes = Router();
CourseRoutes.post("/add/:userId", courseAdding);
CourseRoutes.get("/", getCourses);
CourseRoutes.put("/update/:userId", courseUpdate);
CourseRoutes.delete("/delete/:userId", courseDelete);
CourseRoutes.get("/file/:fileName", fileRetrival);
CourseRoutes.post("/add_file", CourseUpload.single("file"), CourseFileAdding);
export default CourseRoutes;
