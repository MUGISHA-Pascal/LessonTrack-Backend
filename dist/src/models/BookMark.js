"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
class BookMarkInt extends sequelize_1.Model {
}
const BookMark = postgres_1.default.define("BookMark", {
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    courseIds: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
}, { timestamps: true, tableName: "BookMark" });
exports.default = BookMark;
