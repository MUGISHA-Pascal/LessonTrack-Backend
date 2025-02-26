import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
export const postgresConnectionSequelize = new Sequelize(
  "postgresql://pascal:jCS6aJFGQ3CwYVK3H2RyMPlcpOSHcpfO@dpg-cuvgq6ogph6c73esb3j0-a.oregon-postgres.render.com/project_database_kwgc",
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // This allows self-signed certificates
      },
    },
  }
);
// export const postgresConnectionSequelize = new Sequelize({
//   username: "postgres",
//   password: "postgres",
//   database: "LessonTracker",
//   host: "localhost",
//   port: 5432,
//   dialect: "postgres",
//   logging: false,
// });

export default postgresConnectionSequelize;
