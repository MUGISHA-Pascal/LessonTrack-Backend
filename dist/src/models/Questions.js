"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
const { DataTypes } = require("sequelize");
class QuestionInt extends sequelize_1.Model {
}
const Question = postgres_1.default.define("Question", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "quizzes",
            key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "CASCADE",
    },
    question_text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    correct_answer: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    createdAt: true,
    updatedAt: true,
    tableName: "questions",
    schema: "public",
    timestamps: false,
});
exports.default = Question;
