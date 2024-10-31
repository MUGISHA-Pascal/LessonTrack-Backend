"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const profile_1 = __importDefault(require("../middlewares/profile"));
const UserRoutes = (0, express_1.Router)();
UserRoutes.post("/upload_image/:id", profile_1.default.single("ProfilePicture"), UserController_1.profileUploadController);
UserRoutes.delete("/admin/userDelete/:userId");
exports.default = UserRoutes;
