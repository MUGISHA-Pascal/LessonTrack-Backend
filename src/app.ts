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
import LessonRouter from "./routes/LessonRoutes";
import QuizRoutes from "./routes/QuizRoutes";
import CommentRoutes from "./routes/CommentRoutes";
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
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/courses", CourseRoutes);
app.use("/comments", CommentRoutes);
app.use("/feedbacks", FeedbackRoutes);
app.use("/questions", questionRoutes);
app.use("/certificates", certificateRoutes);
app.use("/lessons", LessonRouter);
app.use("/quiz", QuizRoutes);
export default app;
