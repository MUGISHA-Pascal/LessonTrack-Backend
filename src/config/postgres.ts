import { Client } from "pg";
export const postgresConnection = () => {
  const connection = new Client({
    user: "postgres",
    password: "postgres",
    database: "LessonTracker",
    host: "localhost",
    port: 5432,
  });
  connection.connect().then(() => {
    console.log("connected to the postgres database");
  });
};
