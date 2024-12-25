import { Request, Response } from "express";
import User from "../models/User";
import fs from "fs";
import path from "path";
import Notification from "../models/Notification";
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
        user.profilepicture = req.file.path;
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
export const profileUpdateController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, phone_number, email } = req.body;
    const user = await User.findOne({ where: { id } });
    if (user) {
      if (req.file) {
        user.update(
          {
            username,
            phone_number,
            email,
            profilepicture: req.file.filename,
          },
          { where: { id } }
        );
        res.json({ message: "user image uploaded successfully", user });
      } else {
        res.status(400).json({ message: "no image file uploaded" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log("here", error);
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
  const filePath = path.join(__dirname, "../../uploads/images", ImageName);

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
      { username: fullname, nickname: nickname, gender, phone_number, email },
      { where: { id } }
    );
    console.log(userUpdated);
    res.status(201).json({ user: userUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { setting_name, setting_value } = req.body;

    const userUpdated = await User.update(
      { [setting_name]: setting_value },
      { where: { id } }
    );

    if (userUpdated[0] === 0) {
      res.status(404).json({ message: "User or setting not found." });
    } else {
      res.status(200).json({ message: "Setting updated successfully." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred.", error });
  }
};
export const fill = async (req: Request, res: Response) => {
  try {
    const { fullname, nickname, number, id } = req.body;
    const userUpdated = await User.update(
      { username: fullname, nickname: nickname, phone_number: number },
      { where: { id } }
    );
    console.log(userUpdated);
    res.status(201).json({ user: userUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
export const updateSeenNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userUpdated = await Notification.update(
      { seen: "Yes" },
      { where: { receiver: id } }
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
    const verified = "YES";
    const userUpdated = await User.update({ pin, verified }, { where: { id } });
    console.log(userUpdated);
    const currentDate = new Date();

    const formattedDate = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD
    const hours = currentDate.getHours(); // Hours (0-23)
    const dateAndHours = `${formattedDate} ${hours}:00`;
    try {
      await Notification.create({
        title: "Murakoze kwiyandikisha",
        description:
          "Hari impamvu wiyandikishije, tangira nonaha maze wige ibirebanye nibinyabziga",
        receiver: id,
        sender: "app",
        sentdate: dateAndHours,
      });
    } catch (error) {
      console.log(error);
    }

    await Notification.create({
      title: "Murakaze neza kuri applocation ya amategeko",
      description:
        "Amategeko app ni application igufasha kwiga ibyerekanye nibinyabiziga byose kubuntu kandi muburyo bworoshye kandi bunoze",
      receiver: id,
      sender: "app",
      sentdate: dateAndHours,
    });
    res.status(201).json({ user: userUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const PushNotification = async (req: Request, res: Response) => {
  try {
    const { device_token, id } = req.body;
    // const verified = "YES";
    const userUpdated = await User.update({ device_token }, { where: { id } });
    console.log(userUpdated);

    res.status(201).json({ user: userUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const GetUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (user) {
      console.log("working");
      res.json({ user });
      return;
    } else {
      res.status(404).json({ message: "user not found" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
    return;
  }
};

export const GetNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await Notification.findAll({
      where: {
        receiver: id,
      },
    });
    if (user) {
      res.status(201).json({ user });
    } else {
      res.status(404).json({ message: "notification not found" });
    }

    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

export const getNumber_of_unseen_messages = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const unseenCount = await Notification.count({
      where: {
        receiver: id,
        seen: "No",
      },
    });
    if (unseenCount) {
      res.status(201).json({ unseenCount });
    } else {
      res.status(404).json({ unseenCount });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getMentors = async (req: Request, res: Response) => {
  try {
    // const { id } = req.params;
    const user = await User.findAll({
      where: {
        role: "sub_admin",
      },
    });

    if (user) {
      res.status(201).json({ user });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
  }
};
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
