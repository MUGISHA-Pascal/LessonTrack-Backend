import cors from "cors";
import express, { Express } from "express";
import dotenv from "dotenv";
import { postgresConnection } from "./config/postgres";
dotenv.config();
const app: Express = express();
app.use(cors());
postgresConnection();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});
