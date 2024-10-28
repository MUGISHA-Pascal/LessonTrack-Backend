"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresConnectionSequelize = void 0;
const sequelize_1 = require("sequelize");
const username = "postgres";
const password = "postgres";
const DatabasePort = 5432;
const database = "LessonTracker2";
exports.postgresConnectionSequelize = new sequelize_1.Sequelize(database, username, password, {
    port: DatabasePort,
    host: "localhost",
    dialect: "postgres",
});
exports.default = exports.postgresConnectionSequelize;
