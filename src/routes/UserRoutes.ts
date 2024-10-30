import { Router } from "express";
import { profileUploadController } from "../controllers/UserController";
import upload from "../middlewares/profile";

const UserRoutes = Router();
UserRoutes.post(
  "/upload_image/:id",
  upload.single("ProfilePicture"),
  profileUploadController
);
export default UserRoutes;
