"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
class TakenInt extends sequelize_1.Model {
}
const Taken = postgres_1.default.define("Taken", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    quiz: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    marks: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    userid: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "Taken", // Optional, defines the table name explicitly if needed
    timestamps: false, // Set to true if you want `createdAt` and `updatedAt`
});
exports.default = Taken;
