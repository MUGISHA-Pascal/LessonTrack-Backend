import { Router } from "express";
import {
  AddPin,
  AdminUserDelete,
  fill,
  fillProfile,
  getMentors,
  GetNotificationById,
  getNumber_of_unseen_messages,
  GetUserById,
  imageRetrival,
  profileUpdateController,
  profileUploadController,
  PushNotification,
  updateSeenNotification,
  updateSetting,
} from "../controllers/UserController";
import upload from "../middlewares/profile";

const UserRoutes = Router();
UserRoutes.put(
  "/upload_profile/:id",
  upload.single("ProfilePicture"),
  profileUploadController
);
UserRoutes.put("/update/:id", upload.single("file"), profileUpdateController);
UserRoutes.delete("/admin/delete-user/:userId", AdminUserDelete);
UserRoutes.get("/image/:ImageName", imageRetrival);
UserRoutes.put("/fill_profile", fillProfile);
UserRoutes.put("/fill", fill);
UserRoutes.put("/add_pin", AddPin);
UserRoutes.get("/get_user/:id", GetUserById);
UserRoutes.get("/get_mentor", getMentors);
UserRoutes.put("/change/:id", updateSetting);
UserRoutes.get("/number/:id", getNumber_of_unseen_messages);
UserRoutes.put("/not/:id", updateSeenNotification);
UserRoutes.get("/notification/:id", GetNotificationById);
UserRoutes.put("/savetoken", PushNotification);

export default UserRoutes;
