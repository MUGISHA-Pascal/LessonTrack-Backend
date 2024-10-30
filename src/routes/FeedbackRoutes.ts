import { Router } from "express";
import {
  feedbackAdding,
  feedbackDelete,
  feedbackUpdate,
  getFeedbacks,
} from "../controllers/FeedbackController";

const FeedbackRoutes = Router();
FeedbackRoutes.post("/add_feedback/:userId", feedbackAdding);
FeedbackRoutes.get("/get_feedback", getFeedbacks);
FeedbackRoutes.put("/update_feedback/:userId", feedbackUpdate);
FeedbackRoutes.delete("/delete_feedback/:feedbackId", feedbackDelete);
export default FeedbackRoutes;
