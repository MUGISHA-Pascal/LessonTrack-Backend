"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresConnectionSequelize = void 0;
const sequelize_1 = require("sequelize");
//"postgresql://pascal:3jK9zA11ecRw2AbiaKdICGbP2yzP1KJc@dpg-csl2egbv2p9s73aebpe0-a.oregon-postgres.render.com/lessontracker",
exports.postgresConnectionSequelize = new sequelize_1.Sequelize({
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
exports.default = exports.postgresConnectionSequelize;
