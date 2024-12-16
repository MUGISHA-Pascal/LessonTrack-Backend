"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const profile_1 = __importDefault(require("../middlewares/profile"));
const UserRoutes = (0, express_1.Router)();
UserRoutes.put("/upload_profile/:id", profile_1.default.single("ProfilePicture"), UserController_1.profileUploadController);
UserRoutes.delete("/admin/delete-user/:userId", UserController_1.AdminUserDelete);
UserRoutes.get("/image/:ImageName", UserController_1.imageRetrival);
UserRoutes.put("/fill_profile", UserController_1.fillProfile);
UserRoutes.put("/fill", UserController_1.fill);
UserRoutes.put("/add_pin", UserController_1.AddPin);
UserRoutes.get("/get_user/:id", UserController_1.GetUserById);
exports.default = UserRoutes;
