import { Router } from "express";
import {
  courseAdding,
  courseDelete,
  CourseFileAdding,
  courseimageRetrival,
  courseprofileUploadController,
  courseUpdate,
  fileRetrival,
  GetCourseByCategory,
  getCourses,
} from "../controllers/CourseController";
import CourseUpload from "../middlewares/CourseUpload";
import upload from "../middlewares/profile";

const CourseRoutes = Router();
CourseRoutes.post("/add/:userId", courseAdding);
CourseRoutes.get("/", getCourses);
CourseRoutes.put("/update/:userId", courseUpdate);
CourseRoutes.delete("/delete/:userId", courseDelete);
CourseRoutes.get("/file/:fileName", fileRetrival);
CourseRoutes.post("/add_file", CourseUpload.single("file"), CourseFileAdding);
CourseRoutes.get("/get_courses/:category", GetCourseByCategory);
CourseRoutes.put(
  "/upload_profile/:id",
  upload.single("ProfilePicture"),
  courseprofileUploadController
);
CourseRoutes.get("/image/:ImageName", courseimageRetrival);
export default CourseRoutes;
