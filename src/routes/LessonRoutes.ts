import { Router } from "express";

const LessonRouter = Router();
LessonRouter.post("/add_lesson/:userId");
LessonRouter.get("/get_lesson/:userId");
LessonRouter.put("/update_lesson/:userId");
LessonRouter.delete("/delete_lesson/:lessonId");
export default LessonRouter;
