import { Sequelize } from "sequelize";
//"postgresql://pascal:3jK9zA11ecRw2AbiaKdICGbP2yzP1KJc@dpg-csl2egbv2p9s73aebpe0-a.oregon-postgres.render.com/lessontracker",
export const postgresConnectionSequelize = new Sequelize({
  username: "postgres",
  password: "postgres",
  database: "LessonTracker",
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false,
  //   },
});

export default postgresConnectionSequelize;
