"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CourseController_1 = require("../controllers/CourseController");
const CourseController_2 = require("../controllers/CourseController");
const CourseUpload_1 = __importDefault(require("../middlewares/CourseUpload"));
const profile_1 = __importDefault(require("../middlewares/profile"));
const videoUpload_1 = __importDefault(require("../middlewares/videoUpload"));
const CourseRoutes = (0, express_1.Router)();
CourseRoutes.post("/add/:userId", CourseController_1.courseAdding);
CourseRoutes.get("/", CourseController_1.getCourses);
CourseRoutes.get("/booked/:userId", CourseController_1.getBooking);
CourseRoutes.get("/module/:id", CourseController_1.getModule);
CourseRoutes.get("/cat", CourseController_1.getCat);
CourseRoutes.get("/catP", CourseController_1.getCatPoplular);
CourseRoutes.get("/userCourses/:userId", CourseController_1.UsergetCourses);
CourseRoutes.put("/update/:userId", CourseController_1.courseUpdate);
CourseRoutes.delete("/delete/:courseId/:userId", CourseController_1.courseDelete);
CourseRoutes.get("/file/:fileName", CourseController_1.fileRetrival);
CourseRoutes.post("/add_file", CourseUpload_1.default.single("file"), CourseController_2.CourseFileAdding);
CourseRoutes.get("/get_courses/:category", CourseController_1.GetCourseByCategory);
CourseRoutes.get("/search", CourseController_1.getCoursesByKeyword);
CourseRoutes.get("/triple_relation/:userId", CourseController_1.tripleRelation);
CourseRoutes.get("/taken/:userId", CourseController_1.TakeLast);
CourseRoutes.put("/upload_profile/:id", profile_1.default.single("profilepicture"), CourseController_1.courseprofileUploadController);
CourseRoutes.get("/image/:ImageName", CourseController_1.courseimageRetrival);
CourseRoutes.put("/course_taken_handle/:userId", CourseController_1.courseTakenHandling);
CourseRoutes.put("/bookmark/:userId", CourseController_1.BookMarkHandling);
CourseRoutes.get("/bookmarked/:userId", CourseController_1.checkBookmark);
CourseRoutes.put("/user_increment/:courseId", CourseController_1.userIncrement);
CourseRoutes.get("/descending_retrival", CourseController_1.CourseRetrivalBasingOnUserCount);
CourseRoutes.get("/descending_retrival_category/:category", CourseController_1.CourseRetrievalByCategoryAndUserCount);
CourseRoutes.get("/rating_retrival/:id", CourseController_1.RatingRetrieval);
CourseRoutes.post("/rating_update/:id", CourseController_1.ratingUpdate);
CourseRoutes.post("/module", CourseController_1.addingModule);
CourseRoutes.get("/fetch/:id", CourseController_1.getQuiz);
CourseRoutes.post("/lesson_adding", CourseController_1.LessonAdding);
CourseRoutes.put("/upload-video", videoUpload_1.default.single("file"), CourseController_1.videoUploadController);
CourseRoutes.put("/add_users/:userId", CourseController_1.addUserTakingCourse);
CourseRoutes.get("/get_users/:courseId", CourseController_1.getUsersTakingCourse);
CourseRoutes.put("/update_module/:courseId", CourseController_1.updateModules);
exports.default = CourseRoutes;
