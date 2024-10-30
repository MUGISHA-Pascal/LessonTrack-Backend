"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = __importDefault(require("../config/postgres"));
const { DataTypes } = require("sequelize");
const UserCourse = postgres_1.default.define("UserCourse", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "CASCADE",
        primaryKey: true,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "courses",
            key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "CASCADE",
        primaryKey: true,
    },
    enrollment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "user_courses",
    schema: "public",
    timestamps: false,
});
module.exports = UserCourse;
