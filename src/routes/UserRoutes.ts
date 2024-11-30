import { Router } from "express";
import {
  AdminUserDelete,
  imageRetrival,
  profileUploadController,
} from "../controllers/UserController";
import upload from "../middlewares/profile";

const UserRoutes = Router();
UserRoutes.post(
  "/upload_profile/:id",
  upload.single("ProfilePicture"),
  profileUploadController
);
UserRoutes.delete("/admin/delete-user/:userId", AdminUserDelete);
UserRoutes.get("/image/:ImageName", imageRetrival);
export default UserRoutes;
