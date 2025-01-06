import { Router } from "express";
import {
  
  getCategory,
  getQuiz,
  getQuizes,
  getQuizesCat,
  getQuizesExam,
  getQuizesLast,
  getQuizesStart,
  getYourDoneQuiz,
  // questionAnswersHandling,
  quizAdding,
  quizDelete,
  quizUpdate,
  saveQuiz,
  update,
} from "../controllers/QuizController";

const QuizRoutes = Router();
QuizRoutes.post("/add/:userId", quizAdding);
QuizRoutes.get("/cat", getCategory);
QuizRoutes.get("/:course_id", getQuiz);
QuizRoutes.get("/done/:userid", getYourDoneQuiz);
QuizRoutes.get("/", getQuizes);
QuizRoutes.get("/exam/exam", getQuizesExam);
QuizRoutes.get("/cat/:cat", getQuizesCat);
QuizRoutes.get("/started/:id", getQuizesStart);

QuizRoutes.post("/save", saveQuiz)
QuizRoutes.post("/update", update)
QuizRoutes.get("/lastcourse/:id", getQuizesLast);
QuizRoutes.put("/update/:userId", quizUpdate);
QuizRoutes.delete("/delete/:quizId/:userId", quizDelete);
// QuizRoutes.post("/answers_handling", questionAnswersHandling);
export default QuizRoutes;
