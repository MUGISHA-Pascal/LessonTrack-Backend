"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresConnectionSequelize = void 0;
const sequelize_1 = require("sequelize");
// export const postgresConnectionSequelize = new Sequelize({
//   username: "postgres",
//   password: "postgres",
//   database: "LessonTracker",
//   host: "localhost",
//   port: 5432,
//   dialect: "postgres",
//   logging: false,
// });
exports.postgresConnectionSequelize = new sequelize_1.Sequelize("postgresql://project_db_zbj3_user:N5a6gDdPJT3VhOlptL012d53aqSTuUkM@dpg-ctlvrh9opnds73fc574g-a/project_db_zbj3", { dialect: "postgres" });
exports.default = exports.postgresConnectionSequelize;
