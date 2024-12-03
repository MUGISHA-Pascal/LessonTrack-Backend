import { Router } from "express";
import {
  AddPin,
  AdminUserDelete,
  fillProfile,
  imageRetrival,
  profileUploadController,
} from "../controllers/UserController";
import upload from "../middlewares/profile";

const UserRoutes = Router();
UserRoutes.put(
  "/upload_profile/:id",
  upload.single("ProfilePicture"),
  profileUploadController
);
UserRoutes.delete("/admin/delete-user/:userId", AdminUserDelete);
UserRoutes.get("/image/:ImageName", imageRetrival);
UserRoutes.put("/fill_profile", fillProfile);
UserRoutes.put("/add_pin", AddPin);
export default UserRoutes;
