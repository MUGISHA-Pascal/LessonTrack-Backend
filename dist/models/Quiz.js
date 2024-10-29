"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
const quiz = postgres_1.default.define("quizzes", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    course_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
});
