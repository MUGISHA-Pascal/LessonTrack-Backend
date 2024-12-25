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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_1 = require("./config/postgres");
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const CourserRoutes_1 = __importDefault(require("./routes/CourserRoutes"));
const FeedbackRoutes_1 = __importDefault(require("./routes/FeedbackRoutes"));
const QuestionRoutes_1 = __importDefault(require("./routes/QuestionRoutes"));
const CertificateRoute_1 = __importDefault(require("./routes/CertificateRoute"));
const QuizRoutes_1 = __importDefault(require("./routes/QuizRoutes"));
const CommentRoutes_1 = __importDefault(require("./routes/CommentRoutes"));
const Notification_1 = __importDefault(require("./models/Notification"));
const User_1 = __importDefault(require("./models/User"));
const { Expo } = require("expo-server-sdk");
let expo = new Expo();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
postgres_1.postgresConnectionSequelize
    .authenticate()
    .then(() => {
    console.log("connected to the db");
})
    .catch((error) => {
    console.log(error);
});
postgres_1.postgresConnectionSequelize.sync({ alter: true });
app.get("/send-notifications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Fetch unsent notifications from the database
        const unsentNotifications = yield Notification_1.default.findAll({
            where: { pushed: "No" },
        });
        if (unsentNotifications.length === 0) {
            console.log("No unsent notifications found.");
            //  res.status(200).send('No unsent notifications found.');
        }
        // Step 2: Prepare push messages
        const messages = [];
        for (const notification of unsentNotifications) {
            // Fetch the user details based on the receiver ID
            const user = yield User_1.default.findByPk(notification.receiver);
            if (!user || user.device_token == null) {
                console.error(`No user or device token found for receiver_id: ${notification.receiver}`);
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
        const tickets = [];
        for (const chunk of chunks) {
            try {
                const ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
                console.log("Sent chunk:", ticketChunk);
            }
            catch (error) {
                console.error("Error sending push notifications:", error);
            }
        }
        // Step 4: Update notifications as sent in the database
        for (let i = 0; i < tickets.length; i++) {
            const ticket = tickets[i];
            const notificationId = messages[i].data.notificationId;
            if (ticket.status === "ok") {
                yield Notification_1.default.update({ pushed: "Yes" }, { where: { id: notificationId } });
                console.log(`Notification ${notificationId} marked as pushed.`);
            }
            else {
                console.error(`Failed to send notification ${notificationId}:`, ticket.details);
            }
        }
        res.status(200).send("Notifications processed successfully.");
    }
    catch (error) {
        console.error("An error occurred:", error);
        // res.status(500).send('An error occurred while sending notifications.');
    }
}));
// Start
app.use("/auth", AuthRoutes_1.default);
app.use("/user", UserRoutes_1.default);
app.use("/courses", CourserRoutes_1.default);
app.use("/comments", CommentRoutes_1.default);
app.use("/feedbacks", FeedbackRoutes_1.default);
app.use("/questions", QuestionRoutes_1.default);
app.use("/certificates", CertificateRoute_1.default);
app.use("/quiz", QuizRoutes_1.default);
exports.default = app;
