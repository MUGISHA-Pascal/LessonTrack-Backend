"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserDelete = exports.profileUploadController = void 0;
const User_1 = __importDefault(require("../models/User"));
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and profile
 */
/**
 * @swagger
 * /user/{id}/upload-profile:
 *   post:
 *     summary: Upload a profile picture for a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user image uploaded successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: No image file uploaded
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const profileUploadController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findOne({ where: { id } });
        if (user) {
            if (req.file) {
                user.profilePicture = req.file.path;
                user.save();
                res.json({ message: "user image uploaded successfully", user });
            }
            else {
                res.status(400).json({ message: "no image file uploaded" });
            }
        }
        else {
            res.status(404).json({ message: "user not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});
exports.profileUploadController = profileUploadController;
/**
 * @swagger
 * /admin/{userId}/delete-user:
 *   delete:
 *     summary: Delete a user by admin
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the admin user performing the delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deleteUserId:
 *                 type: integer
 *                 description: ID of the user to be deleted
 *                 example: 2
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user deleted successfully"
 *                 deletedUsers:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: Not eligible to delete users
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const AdminUserDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { deleteUserId } = req.body;
        const user = yield User_1.default.findOne({ where: { id: userId } });
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const deletedUsers = yield User_1.default.destroy({ where: { id: deleteUserId } });
            res.json({ message: "user deleted successfully", deletedUsers });
        }
        else {
            res.status(403).json({ message: "you are not eligible to delete users" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});
exports.AdminUserDelete = AdminUserDelete;
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "johndoe@example.com"
 *         role:
 *           type: string
 *           example: "user"
 *         profilePicture:
 *           type: string
 *           example: "https://example.com/profile-pictures/johndoe.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-02T12:00:00Z"
 */
