"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
class NotificationInt extends sequelize_1.Model {
}
const Notification = postgres_1.default.define("Notification", {
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
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    sender: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    receiver: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    sentdate: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: true,
    },
    seen: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "No",
        allowNull: false
    },
    pushed: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "No",
        allowNull: false,
    }
}, {
    tableName: "notification",
    schema: "public",
    timestamps: false,
});
exports.default = Notification;
