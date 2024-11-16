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
import swaggerDocs from "./swagger";
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
app.use("/comments", CourseRoutes);
app.use("/feedbacks", FeedbackRoutes);
app.use("/questions", questionRoutes);
app.use("/certificates", certificateRoutes);
app.use("/lessons", LessonRouter);
app.use("/quiz", QuizRoutes);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});
swaggerDocs(app, port);
