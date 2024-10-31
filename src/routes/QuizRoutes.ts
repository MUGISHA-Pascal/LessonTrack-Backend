import { Router } from "express";

const QuizRoutes = Router();
QuizRoutes.post("/add_question/:userId");
QuizRoutes.get("/get_questions");
QuizRoutes.put("/update_question/:userId");
QuizRoutes.delete("/delete_question/:questionId");
export default QuizRoutes;
