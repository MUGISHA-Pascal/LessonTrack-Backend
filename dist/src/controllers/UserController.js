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
exports.GetUserById = exports.AddPin = exports.fill = exports.fillProfile = exports.imageRetrival = exports.AdminUserDelete = exports.profileUploadController = void 0;
const User_1 = __importDefault(require("../models/User"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and profile
 */
/**
 * @swagger
 * /user/upload-profile/{id}:
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
// using multer-s3 and aws to handle the upload folder
/**
 * @swagger
 * /user/admin/delete-user/{userId}:
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
/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the file.
 *         filename:
 *           type: string
 *           description: Name of the uploaded file.
 *         mimetype:
 *           type: string
 *           description: MIME type of the file (e.g., image/jpeg, application/pdf).
 *         size:
 *           type: integer
 *           description: Size of the file in bytes.
 *         storagePath:
 *           type: string
 *           description: Path where the file is stored on the server.
 *         sender:
 *           type: string
 *           description: Email or identifier of the sender.
 *         receiver:
 *           type: string
 *           description: Email or identifier of the receiver.
 *       required:
 *         - filename
 *         - mimetype
 *         - size
 *         - storagePath
 *         - sender
 *         - receiver
 *       example:
 *         id: 1
 *         filename: example.jpg
 *         mimetype: image/jpeg
 *         size: 2048
 *         storagePath: /uploads/example.jpg
 *         sender: sender@example.com
 *         receiver: receiver@example.com
 */
const imageRetrival = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ImageName } = req.params;
    const filePath = path_1.default.join(__dirname, "../../uploads/images", ImageName);
    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
        if (err) {
            res.status(404).json({ error: "Image not found" });
        }
        res.sendFile(filePath);
    });
});
exports.imageRetrival = imageRetrival;
const fillProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, nickname, email, gender, phone_number, id } = req.body;
        const userUpdated = yield User_1.default.update({ username: fullname, nickName: nickname, gender, phone_number, email }, { where: { id } });
        console.log(userUpdated);
        res.status(201).json({ user: userUpdated });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});
exports.fillProfile = fillProfile;
const fill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, nickname, number, id } = req.body;
        const userUpdated = yield User_1.default.update({ username: fullname, nickName: nickname, phone_number: number }, { where: { id } });
        console.log(userUpdated);
        res.status(201).json({ user: userUpdated });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});
exports.fill = fill;
const AddPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pin, id } = req.body;
        const verified = "YES";
        const userUpdated = yield User_1.default.update({ pin, verified }, { where: { id } });
        console.log(userUpdated);
        res.status(201).json({ user: userUpdated });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});
exports.AddPin = AddPin;
const GetUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findByPk(id);
        if (user) {
            res.status(201).json({ user });
        }
        else {
            res.status(404).json({ message: "user not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.GetUserById = GetUserById;
/**
 * @openapi
 * /users/image/{ImageName}:
 *   get:
 *     summary: Retrieve a user's image
 *     description: Allows users to retrieve an image by providing the image name.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: ImageName
 *         required: true
 *         description: The name of the image to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The image was found and is being returned.
 *       404:
 *         description: Image not found
 */
/**
 * @openapi
 * /users/fill_profile:
 *   put:
 *     summary: Update user profile
 *     description: Allows users to update their profile information such as fullname, nickname, email, gender, and phone number.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: The full name of the user.
 *               nickname:
 *                 type: string
 *                 description: The nickname of the user.
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               gender:
 *                 type: string
 *                 description: The gender of the user.
 *               phone_number:
 *                 type: string
 *                 description: The phone number of the user.
 *               id:
 *                 type: string
 *                 description: The ID of the user whose profile is being updated.
 *     responses:
 *       201:
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: The updated user profile.
 *       500:
 *         description: Internal server error
 */
/**
 * @openapi
 * /users/add_pin:
 *   put:
 *     summary: Add or update user pin
 *     description: Allows users to add or update their pin for security purposes.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pin:
 *                 type: string
 *                 description: The pin to be set for the user.
 *               id:
 *                 type: string
 *                 description: The ID of the user whose pin is being updated.
 *     responses:
 *       201:
 *         description: Pin updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: The user with the updated pin.
 *       500:
 *         description: Internal server error
 */
/**
 * @openapi
 * /users/get_user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves the user details by the given user ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: The user was found and returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: The user details.
 *       404:
 *         description: User not found
 */
