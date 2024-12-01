import { Request, Response } from "express";
import User from "../models/User";
import fs from "fs";
import path from "path";
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
export const profileUploadController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (user) {
      if (req.file) {
        user.profilePicture = req.file.path;
        user.save();
        res.json({ message: "user image uploaded successfully", user });
      } else {
        res.status(400).json({ message: "no image file uploaded" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};
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
export const AdminUserDelete = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { deleteUserId } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user?.role === "admin") {
      const deletedUsers = await User.destroy({ where: { id: deleteUserId } });
      res.json({ message: "user deleted successfully", deletedUsers });
    } else {
      res.status(403).json({ message: "you are not eligible to delete users" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};
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
export const imageRetrival = async (req: Request, res: Response) => {
  const { ImageName } = req.params;
  const filePath = path.join(__dirname, "../../uploads", ImageName);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json({ error: "Image not found" });
    }
    res.sendFile(filePath);
  });
};

export const fillProfile = async (req: Request, res: Response) => {
  try {
    const { fullname, nickname, email, gender, phone_number, id } = req.body;
    const userUpdated = await User.update(
      { username: fullname, nickName: nickname, gender, phone_number, email },
      { where: { id } }
    );
    console.log(userUpdated);
    res.status(201).json({ user: userUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const AddPin = async (req: Request, res: Response) => {
  try {
    const { pin, id } = req.body;
    const userUpdated = await User.update({ pin }, { where: { id } });
    console.log(userUpdated);
    res.status(201).json({ user: userUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
