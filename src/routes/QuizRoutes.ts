import { Router } from "express";
import {
  getQuiz,
  quizAdding,
  quizDelete,
  quizUpdate,
} from "../controllers/QuizController";

const QuizRoutes = Router();
QuizRoutes.post("/add_question/:userId", quizAdding);
QuizRoutes.get("/get_questions", getQuiz);
QuizRoutes.put("/update_question/:userId", quizUpdate);
QuizRoutes.delete("/delete_question/:questionId", quizDelete);
export default QuizRoutes;
