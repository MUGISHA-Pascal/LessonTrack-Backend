import cors from "cors";
import express, { Express } from "express";
import dotenv from "dotenv";
import { postgresConnectionSequelize } from "./config/postgres";
dotenv.config();
const app: Express = express();
app.use(cors());

postgresConnectionSequelize
  .authenticate()
  .then(() => {
    console.log("connected to the db");
  })
  .catch((error) => {
    console.log(error);
  });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});
