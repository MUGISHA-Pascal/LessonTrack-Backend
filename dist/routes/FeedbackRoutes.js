"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FeedbackController_1 = require("../controllers/FeedbackController");
const FeedbackRoutes = (0, express_1.Router)();
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
FeedbackRoutes.post("/add_feedback/:userId", FeedbackController_1.feedbackAdding);
FeedbackRoutes.get("/get_feedback", FeedbackController_1.getFeedbacks);
FeedbackRoutes.put("/update_feedback/:userId", FeedbackController_1.feedbackUpdate);
FeedbackRoutes.delete("/delete_feedback/:feedbackId", FeedbackController_1.feedbackDelete);
exports.default = FeedbackRoutes;
