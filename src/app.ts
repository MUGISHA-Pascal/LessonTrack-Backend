import cors from "cors";
import express, { Express } from "express";
import dotenv from "dotenv";
import { postgresConnectionSequelize } from "./config/postgres";
import AuthRoutes from "./routes/AuthRoutes";
import bodyParser from "body-parser";
import UserRoutes from "./routes/UserRoutes";
import CourseRoutes from "./routes/CourserRoutes";
import FeedbackRoutes from "./routes/FeedbackRoutes";
import questionRoutes from "./routes/QuestionRoutes";
import certificateRoutes from "./routes/CertificateRoute";
import QuizRoutes from "./routes/QuizRoutes";
import CommentRoutes from "./routes/CommentRoutes";
import Notification from "./models/Notification";
import User from "./models/User";
import { Request, Response } from "express";
const { Expo } = require("expo-server-sdk");
let expo = new Expo();

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

postgresConnectionSequelize
  .authenticate()
  .then(() => {
    console.log("connected to the db");
  })
  .catch((error) => {
    console.log(error);
  });
postgresConnectionSequelize.sync({ alter: true });
app.get(
  "/send-notifications",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Step 1: Fetch unsent notifications from the database
      const unsentNotifications = await Notification.findAll({
        where: { pushed: "No" },
      });

      if (unsentNotifications.length === 0) {
        console.log("No unsent notifications found.");
        //  res.status(200).send('No unsent notifications found.');
      }

      // Step 2: Prepare push messages
      const messages: {
        to: string;
        sound: string;
        body: string;
        data: any;
        title: string;
      }[] = [];
      for (const notification of unsentNotifications) {
        // Fetch the user details based on the receiver ID
        const user = await User.findByPk(notification.receiver);

        if (!user || user.device_token == null) {
          console.error(
            `No user or device token found for receiver_id: ${notification.receiver}`
          );
          continue;
        }

        const pushToken = user.device_token;

        // Validate Expo push token
        if (!Expo.isExpoPushToken(pushToken)) {
          console.error(`Invalid Expo push token: ${pushToken}`);
          continue;
        }

        // Construct the push message
        messages.push({
          to: pushToken,
          sound: "default",
          title: notification.title,

          body: notification.description,
          data: { notificationId: notification.id },
        });
      }

      if (messages.length === 0) {
        console.log("No valid push tokens found.");
        //  res.status(200).send('No valid push tokens found.');
      }

      // Step 3: Send push notifications
      const chunks = expo.chunkPushNotifications(messages);
      const tickets: any[] = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
          console.log("Sent chunk:", ticketChunk);
        } catch (error) {
          console.error("Error sending push notifications:", error);
        }
      }

      // Step 4: Update notifications as sent in the database
      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        const notificationId = messages[i].data.notificationId;

        if (ticket.status === "ok") {
          await Notification.update(
            { pushed: "Yes" },
            { where: { id: notificationId } }
          );
          console.log(`Notification ${notificationId} marked as pushed.`);
        } else {
          console.error(
            `Failed to send notification ${notificationId}:`,
            ticket.details
          );
        }
      }

      res.status(200).send("Notifications processed successfully.");
    } catch (error) {
      console.error("An error occurred:", error);
      // res.status(500).send('An error occurred while sending notifications.');
    }
  }
);

// Start
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/courses", CourseRoutes);
app.use("/comments", CommentRoutes);
app.use("/feedbacks", FeedbackRoutes);
app.use("/questions", questionRoutes);
app.use("/certificates", certificateRoutes);
app.use("/quiz", QuizRoutes);

export default app;
