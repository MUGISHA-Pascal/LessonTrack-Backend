"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const messageSchema = mongoose.Schema({
//     sender: { type: String, required: true },
//     message: { type: String, required: true, },
//     receiver: { type: String, required: true },
//     seen: { type: Boolean, default: false },
//     edited: { type: Boolean, default: false },
//     reactions: [{
//         reaction: String,
//         reactor: String,
//     }],
//     replyingTo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Message',
//         default: null
//     },
//     type: { type: String, required: true },
//     time: { type: String, required: true },
//     timestamp: { type: Date, default: Date.now }
// });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
class MessageInt extends sequelize_1.Model {
}
const Message = postgres_1.default.define("Message", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sender: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    receiver: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    seen: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    edited: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    schema: "public",
    tableName: "messages",
});
exports.default = Message;
