import { Router } from "express";
import {
  commentAdding,
  commentDelete,
  commentUpdate,
  getComments,
} from "../controllers/CommentController";

const CourseRoutes = Router();
CourseRoutes.post("/add/:userId", commentAdding);
CourseRoutes.get("/:userId", getComments);
CourseRoutes.put("/update/:userId", commentUpdate);
CourseRoutes.delete("/delete/:commentId", commentDelete);
export default CourseRoutes;
