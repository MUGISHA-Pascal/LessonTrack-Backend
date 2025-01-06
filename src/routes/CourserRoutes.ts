import { NextFunction, Request as EXPrequest, Response, Router } from "express";
import {
  addingModule,
  addUserTakingCourse,
  BookMarkHandling,
  checkBookmark,
  courseAdding,
  courseDelete,
  CourseFileUpdating,
  courseimageRetrival,
  courseprofileUploadController,
  CourseRetrievalByCategoryAndUserCount,
  CourseRetrivalBasingOnUserCount,
  courseTakenHandling,
  courseUpdate,
  coursevideoRetrival,
  fileRetrival,
  getBooking,
  getCat,
  getCatPoplular,
  GetCourseByCategory,
  getCourseById,
  getCourses,
  getCoursesByKeyword,
  getModule,
  getQuiz,
  getUsersTakingCourse,
  LessonAdding,
  RatingRetrieval,
  ratingUpdate,
  TakeLast,
  tripleRelation,
  updateModules,
  UsergetCourses,
  userIncrement,
  videoDelete,
  videoUploadController,
} from "../controllers/CourseController";
import { CourseFileAdding } from "../controllers/CourseController";
import CourseUpload from "../middlewares/CourseUpload";
import upload from "../middlewares/profile";
import videoUpload from "../middlewares/videoUpload";
import app from "../app";

const CourseRoutes = Router();
CourseRoutes.post("/add/:userId", courseAdding);
CourseRoutes.get("/", getCourses);
CourseRoutes.get("/booked/:userId", getBooking);
CourseRoutes.get("/module/:id", getModule);
CourseRoutes.get("/cat", getCat);
CourseRoutes.get("/catP", getCatPoplular);
CourseRoutes.get("/userCourses/:userId", UsergetCourses);
// CourseRoutes.put("/update/:userId", courseUpdate);
CourseRoutes.put("/delete/:courseId/:userId", courseDelete);
CourseRoutes.get("/file/:fileName", fileRetrival);
CourseRoutes.post("/add_file", CourseUpload.single("file"), CourseFileAdding);
CourseRoutes.put(
  "/update/:courseId",
  CourseUpload.single("file"),
  CourseFileUpdating
);
CourseRoutes.get("/get_courses/:category", GetCourseByCategory);
CourseRoutes.get("/search", getCoursesByKeyword);
CourseRoutes.get("/triple_relation/:userId", tripleRelation);
CourseRoutes.get("/taken/:userId", TakeLast);
CourseRoutes.put(
  "/upload_profile/:id",
  upload.single("profilepicture"),
  courseprofileUploadController
);
CourseRoutes.get("/image/:ImageName", courseimageRetrival);
CourseRoutes.put("/course_taken_handle/:userId", courseTakenHandling);
CourseRoutes.put("/bookmark/:userId", BookMarkHandling);
CourseRoutes.get("/bookmarked/:userId", checkBookmark);
CourseRoutes.put("/user_increment/:courseId", userIncrement);
CourseRoutes.get("/descending_retrival", CourseRetrivalBasingOnUserCount);
CourseRoutes.get(
  "/descending_retrival_category/:category",
  CourseRetrievalByCategoryAndUserCount
);
CourseRoutes.get("/rating_retrival/:id", RatingRetrieval);
CourseRoutes.post("/rating_update/:id", ratingUpdate);
CourseRoutes.post("/module", addingModule);
CourseRoutes.get("/fetch/:id", getQuiz);
CourseRoutes.post("/lesson_adding", LessonAdding);
CourseRoutes.put(
  "/upload-video",
  videoUpload.single("file"),
  videoUploadController
);
CourseRoutes.delete("/delete_video/:courseId", videoDelete);
CourseRoutes.put("/add_users/:userId", addUserTakingCourse);
CourseRoutes.get("/get_users/:courseId", getUsersTakingCourse);
CourseRoutes.put("/update_module/:courseId", updateModules);
CourseRoutes.get("/CourseById/:courseId", getCourseById);
CourseRoutes.get("/course_video/:courseId", coursevideoRetrival);
export default CourseRoutes;
