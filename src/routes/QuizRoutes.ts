import { Router } from "express";
import {
  getQuiz,
  quizAdding,
  quizDelete,
  quizUpdate,
} from "../controllers/QuizController";

const QuizRoutes = Router();
QuizRoutes.post("/add/:userId", quizAdding);
QuizRoutes.get("/", getQuiz);
QuizRoutes.put("/update/:userId", quizUpdate);
QuizRoutes.delete("/delete/:quizId", quizDelete);
export default QuizRoutes;
