import { Router } from "express";

const FeedbackRoutes = Router();
FeedbackRoutes.post("/add_comment/:userId");
FeedbackRoutes.get("/get_comments/:userId");
FeedbackRoutes.put("/update_comment/:userId");
FeedbackRoutes.delete("/delete_comment/:commentId");
export default FeedbackRoutes;
