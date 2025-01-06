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
exports.getMentors = exports.getNumber_of_unseen_messages = exports.GetNotificationById = exports.GetUserById = exports.PushNotification = exports.AddPin = exports.updateSeenNotification = exports.fill = exports.updateSetting = exports.fillProfile = exports.imageRetrivalWeb = exports.imageRetrivalMessage = exports.imageRetrival = exports.AdminUserDelete = exports.profileUpdateController = exports.profileUploadController = void 0;
const User_1 = __importDefault(require("../models/User"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Notification_1 = __importDefault(require("../models/Notification"));
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
                user.profilepicture = req.file.filename;
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
const profileUpdateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { username, phone_number, email } = req.body;
        const user = yield User_1.default.findOne({ where: { id } });
        if (user) {
            if (req.file) {
                user.update({
                    username,
                    phone_number,
                    email,
                    profilepicture: req.file.filename,
                }, { where: { id } });
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
        console.log("here", error);
        res.status(500).json({ message: "server error" });
    }
});
exports.profileUpdateController = profileUpdateController;
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
 *         profilepicture:
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
const imageRetrivalMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ImageName } = req.params;
    const filePath = path_1.default.join(__dirname, "../../uploads/messages", ImageName);
    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
        if (err) {
            res.status(404).json({ error: "Image not found" });
        }
        res.sendFile(filePath);
    });
});
exports.imageRetrivalMessage = imageRetrivalMessage;
const imageRetrivalWeb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ImageName } = req.params;
    const filePath = path_1.default.join(__dirname, "../../uploads/", ImageName);
    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
        if (err) {
            res.status(404).json({ error: "Image not found" });
        }
        res.sendFile(filePath);
    });
});
exports.imageRetrivalWeb = imageRetrivalWeb;
const fillProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, nickname, email, gender, phone_number, id } = req.body;
        const userUpdated = yield User_1.default.update({ username: fullname, nickname: nickname, gender, phone_number, email }, { where: { id } });
        console.log(userUpdated);
        res.status(201).json({ user: userUpdated });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});
exports.fillProfile = fillProfile;
const updateSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { setting_name, setting_value } = req.body;
        const userUpdated = yield User_1.default.update({ [setting_name]: setting_value }, { where: { id } });
        if (userUpdated[0] === 0) {
            res.status(404).json({ message: "User or setting not found." });
        }
        else {
            res.status(200).json({ message: "Setting updated successfully." });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred.", error });
    }
});
exports.updateSetting = updateSetting;
const fill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, nickname, number, id } = req.body;
        const userUpdated = yield User_1.default.update({ username: fullname, nickname: nickname, phone_number: number }, { where: { id } });
        console.log(userUpdated);
        res.status(201).json({ user: userUpdated });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});
exports.fill = fill;
const updateSeenNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userUpdated = yield Notification_1.default.update({ seen: "Yes" }, { where: { receiver: id } });
        console.log(userUpdated);
        res.status(201).json({ user: userUpdated });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});
exports.updateSeenNotification = updateSeenNotification;
const AddPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pin, id } = req.body;
        const verified = "YES";
        const userUpdated = yield User_1.default.update({ pin, verified }, { where: { id } });
        console.log(userUpdated);
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD
        const hours = currentDate.getHours(); // Hours (0-23)
        const dateAndHours = `${formattedDate} ${hours}:00`;
        try {
            yield Notification_1.default.create({
                title: "Murakoze kwiyandikisha",
                description: "Hari impamvu wiyandikishije, tangira nonaha maze wige ibirebanye nibinyabziga",
                receiver: id,
                sender: "app",
                sentdate: dateAndHours,
            });
        }
        catch (error) {
            console.log(error);
        }
        yield Notification_1.default.create({
            title: "Murakaze neza kuri applocation ya amategeko",
            description: "Amategeko app ni application igufasha kwiga ibyerekanye nibinyabiziga byose kubuntu kandi muburyo bworoshye kandi bunoze",
            receiver: id,
            sender: "app",
            sentdate: dateAndHours,
        });
        res.status(201).json({ user: userUpdated });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});
exports.AddPin = AddPin;
const PushNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { device_token, id } = req.body;
        // const verified = "YES";
        const userUpdated = yield User_1.default.update({ device_token }, { where: { id } });
        console.log(userUpdated);
        res.status(201).json({ user: userUpdated });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});
exports.PushNotification = PushNotification;
const GetUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findByPk(id);
        if (user) {
            // console.log("working");
            res.json({ user });
            return;
        }
        else {
            res.status(404).json({ message: "user not found" });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
        return;
    }
});
exports.GetUserById = GetUserById;
const GetNotificationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield Notification_1.default.findAll({
            where: {
                receiver: id,
            },
        });
        if (user) {
            res.status(201).json({ user });
        }
        else {
            res.status(404).json({ message: "notification not found" });
        }
        console.log(user);
    }
    catch (error) {
        console.log(error);
    }
});
exports.GetNotificationById = GetNotificationById;
const getNumber_of_unseen_messages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Convert id to string to match the `receiver` type in the database
        const receiverId = String(id);
        const unseenCount = yield Notification_1.default.count({
            where: {
                receiver: receiverId, // Use the converted string
                seen: "No",
            },
        });
        if (unseenCount !== undefined) { // Handle 0 as a valid count
            res.status(200).json({ unseenCount });
        }
        else {
            res.status(404).json({ unseenCount: 0 }); // Explicitly return 0 when not found
        }
        // console.log("The count of unseen notifications is:", unseenCount);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching unseen messages." });
    }
});
exports.getNumber_of_unseen_messages = getNumber_of_unseen_messages;
const getMentors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { id } = req.params;
        const user = yield User_1.default.findAll({
            where: {
                role: "sub_admin",
            },
        });
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
exports.getMentors = getMentors;
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
