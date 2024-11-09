import { Router } from "express";
import {
  feedbackAdding,
  feedbackDelete,
  feedbackUpdate,
  getFeedbacks,
} from "../controllers/FeedbackController";

const FeedbackRoutes = Router();
FeedbackRoutes.post("/add/:userId", feedbackAdding);
FeedbackRoutes.get("/", getFeedbacks);
FeedbackRoutes.put("/update/:userId", feedbackUpdate);
FeedbackRoutes.delete("/delete/:feedbackId", feedbackDelete);
export default FeedbackRoutes;
