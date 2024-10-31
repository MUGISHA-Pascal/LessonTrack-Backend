import { Router } from "express";
import { profileUploadController } from "../controllers/UserController";
import upload from "../middlewares/profile";

const UserRoutes = Router();
UserRoutes.post(
  "/upload_image/:id",
  upload.single("ProfilePicture"),
  profileUploadController
);
UserRoutes.delete("/admin/userDelete/:userId");
export default UserRoutes;
