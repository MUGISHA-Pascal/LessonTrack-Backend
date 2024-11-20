import { Router } from "express";
import {
  getQuestions,
  questionAdding,
  questionDelete,
  questionUpdate,
} from "../controllers/QuestionController";

const questionRoutes = Router();
questionRoutes.post("/add/:userId", questionAdding);
questionRoutes.get("/", getQuestions);
questionRoutes.put("/update/:userId", questionUpdate);
questionRoutes.delete("/delete/:questionId", questionDelete);
export default questionRoutes;
