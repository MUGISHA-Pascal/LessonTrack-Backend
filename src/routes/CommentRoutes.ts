import { Router } from "express";
import {
  commentAdding,
  commentDelete,
  commentUpdate,
  getComments,
} from "../controllers/CommentController";

const CommentRoutes = Router();
CommentRoutes.post("/add/:userId", commentAdding);
CommentRoutes.get("/:courseId", getComments);
CommentRoutes.put("/update/:userId", commentUpdate);
CommentRoutes.delete("/delete/:commentId", commentDelete);
export default CommentRoutes;
