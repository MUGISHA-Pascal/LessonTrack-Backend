import { Sequelize } from "sequelize";
const username = "postgres";
const password = "postgres";
const DatabasePort = 5432;
const database = "LessonTracker";
export const postgresConnectionSequelize = new Sequelize(
  database,
  username,
  password,
  {
    port: DatabasePort,
    host: "localhost",
    dialect: "postgres",
  }
);

export default postgresConnectionSequelize;
