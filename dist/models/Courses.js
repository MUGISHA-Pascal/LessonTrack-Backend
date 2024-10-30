"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
const { DataTypes } = require("sequelize");
class CourseInt extends sequelize_1.Model {
}
const Course = postgres_1.default.define("Course", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    content_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [["text", "video", "image"]],
        },
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "SET NULL",
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    createdAt: true,
    updatedAt: true,
    tableName: "courses",
    schema: "public",
    timestamps: false,
});
exports.default = Course;
