import { Sequelize } from "sequelize";

// export const postgresConnectionSequelize = new Sequelize(
//   "postgresql://pascal:e5i7XRKjVXYycMAUIm9vimxZaIf2GpVt@dpg-ctt35q9u0jms73benu4g-a.oregon-postgres.render.com/project_database_wc2n",
//   {
//     dialect: "postgres",
//     logging: false,
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//   }
// );
export const postgresConnectionSequelize = new Sequelize({
  username: "postgres",
  password: "postgres",
  database: "LessonTracker",
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
});

export default postgresConnectionSequelize;
