"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresConnection = void 0;
const pg_1 = require("pg");
const postgresConnection = () => {
    const connection = new pg_1.Client({
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
exports.postgresConnection = postgresConnection;
