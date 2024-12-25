"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
class CourseTakenInt extends sequelize_1.Model {
}
const CourseTaken = postgres_1.default.define("CourseTaken", {
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    courseIds: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    },
    currentCourse: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    timestamps: true,
    tableName: "CourseTaken",
});
exports.default = CourseTaken;
