"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
const { DataTypes } = require("sequelize");
class QuizInt extends sequelize_1.Model {
}
const Quiz = postgres_1.default.define("Quiz", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "courses",
            key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "CASCADE",
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    max_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type_of: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    owners: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "quizzes",
    schema: "public",
    timestamps: false,
    createdAt: true,
    updatedAt: true,
});
exports.default = Quiz;
