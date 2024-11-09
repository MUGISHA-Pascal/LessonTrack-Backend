import { Router } from "express";
import {
  feedbackAdding,
  feedbackDelete,
  feedbackUpdate,
  getFeedbacks,
} from "../controllers/FeedbackController";

const FeedbackRoutes = Router();
/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Retrieve a list of tasks
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Task"
 *       401:
 *         description: Unauthorized - Invalid or missing token.
 */
FeedbackRoutes.post("/add_feedback/:userId", feedbackAdding);
FeedbackRoutes.get("/get_feedback", getFeedbacks);
FeedbackRoutes.put("/update_feedback/:userId", feedbackUpdate);
FeedbackRoutes.delete("/delete_feedback/:feedbackId", feedbackDelete);
export default FeedbackRoutes;
