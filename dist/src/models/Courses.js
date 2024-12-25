"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
class CourseInt extends sequelize_1.Model {
}
const Course = postgres_1.default.define("Course", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    content_type: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        validate: {
            isIn: [["text", "video", "image"]],
        },
    },
    profile_image: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    created_by: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "SET NULL",
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    file: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    module: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
        allowNull: true,
    },
    userCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    ratingAverage: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    ratingCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    createdAt: true,
    updatedAt: true,
    tableName: "courses",
    schema: "public",
    timestamps: false,
});
exports.default = Course;
