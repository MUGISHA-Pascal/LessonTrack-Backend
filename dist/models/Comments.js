"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = __importDefault(require("../config/postgres"));
const { DataTypes } = require("sequelize");
const Comment = postgres_1.default.define("Comment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "CASCADE",
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
    comment_text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "comments",
    schema: "public",
    timestamps: false,
});
exports.default = Comment;
