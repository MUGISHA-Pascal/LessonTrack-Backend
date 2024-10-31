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
app.use("/course", CourseRoutes);
app.use("/comments", CourseRoutes);
app.use("/feedback", FeedbackRoutes);
app.use("/question", questionRoutes);
app.use("/certificate");
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});
