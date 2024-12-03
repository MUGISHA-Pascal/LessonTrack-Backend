import { Router } from "express";
import {
  getLesson,
  lessonAdding,
  lessonDelete,
  lessonUpdate,
} from "../controllers/LessonController";

const LessonRouter = Router();
LessonRouter.post("/add/:userId", lessonAdding);
LessonRouter.get("/:userId", getLesson);
LessonRouter.put("/update/:userId", lessonUpdate);
LessonRouter.delete("/delete/:userId", lessonDelete);
export default LessonRouter;
