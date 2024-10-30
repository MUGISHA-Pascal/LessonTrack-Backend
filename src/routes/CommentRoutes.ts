import { Router } from "express";
import {
  commentAdding,
  commentDelete,
  commentUpdate,
  getComments,
} from "../controllers/CommentController";

const CourseRoutes = Router();
CourseRoutes.post("/add_comment/:userId", commentAdding);
CourseRoutes.get("/get_comments/:userId", getComments);
CourseRoutes.put("/update_comment/:userId", commentUpdate);
CourseRoutes.delete("/delete_comment/:commentId", commentDelete);
export default CourseRoutes;
