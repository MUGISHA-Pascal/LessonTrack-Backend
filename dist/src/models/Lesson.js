"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
const module_1 = __importDefault(require("./module"));
class LessonInt extends sequelize_1.Model {
}
const Lesson = postgres_1.default.define("Lesson", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
    },
    moduleId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            key: "id",
            model: module_1.default,
        },
        onDelete: "CASCADE",
    },
}, {
    tableName: "Lesson",
    timestamps: true,
});
module_1.default.hasMany(Lesson, {
    sourceKey: "id",
    foreignKey: "moduleId",
    as: "lessons",
});
Lesson.belongsTo(module_1.default, {
    targetKey: "id",
    foreignKey: "moduleId",
    as: "module",
});
exports.default = Lesson;
