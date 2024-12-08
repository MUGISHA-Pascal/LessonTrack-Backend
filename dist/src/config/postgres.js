"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresConnectionSequelize = void 0;
const sequelize_1 = require("sequelize");
exports.postgresConnectionSequelize = new sequelize_1.Sequelize({
    username: "postgres",
    password: "postgres",
    database: "LessonTracker",
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false,
});
exports.default = exports.postgresConnectionSequelize;
