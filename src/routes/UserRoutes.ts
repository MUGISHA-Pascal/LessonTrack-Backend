import { Router } from "express";
import { profileUploadController } from "../controllers/UserController";
import upload from "../middlewares/profile";

const UserRoutes = Router();
UserRoutes.post(
  "/upload_profile/:id",
  upload.single("ProfilePicture"),
  profileUploadController
);
UserRoutes.delete("/admin/delete-user/:userId");
export default UserRoutes;
