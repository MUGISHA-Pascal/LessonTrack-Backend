import { Router } from "express";
import {
  getQuestions,
  QuestionAdding,
  questionDelete,

  // questionUpdate,
} from "../controllers/QuestionController";

const questionRoutes = Router();
questionRoutes.post("/add/:userId", QuestionAdding);
questionRoutes.get("/:quiz_id", getQuestions);
// questionRoutes.put("/update/:userId", questionUpdate);
questionRoutes.delete("/delete/:questionId", questionDelete);

export default questionRoutes;
