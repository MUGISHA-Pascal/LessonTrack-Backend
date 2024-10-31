import { Router } from "express";
import {
  getLesson,
  lessonAdding,
  lessonDelete,
  lessonUpdate,
} from "../controllers/LessonController";

const LessonRouter = Router();
LessonRouter.post("/add_lesson/:userId", lessonAdding);
LessonRouter.get("/get_lesson/:userId", getLesson);
LessonRouter.put("/update_lesson/:userId", lessonUpdate);
LessonRouter.delete("/delete_lesson/:lessonId", lessonDelete);
export default LessonRouter;
