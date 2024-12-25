"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
const Courses_1 = __importDefault(require("./Courses"));
class ModuleInt extends sequelize_1.Model {
}
const Module = postgres_1.default.define("Module", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    module: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    courseId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            key: "id",
            model: Courses_1.default,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
});
Courses_1.default.hasMany(Module, {
    foreignKey: "courseId",
    sourceKey: "id",
    as: "modules",
});
Module.belongsTo(Courses_1.default, {
    targetKey: "id",
    foreignKey: "courseId",
    as: "course",
});
exports.default = Module;
