"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../config/postgres"));
const User = postgres_1.default.define("User", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(50),
        unique: true,
        validate: {
            notNull: { msg: "username is not assignable to null" },
        },
    },
    email: {
        type: sequelize_1.DataTypes.STRING(100),
        unique: true,
        validate: {
            notNull: { msg: "username is not assignable to null" },
            isEmail: {
                msg: "email is not valid",
            },
        },
    },
    phone_number: {
        type: sequelize_1.DataTypes.NUMBER,
        unique: true,
    },
    password_hash: {
        type: sequelize_1.DataTypes.STRING(255),
        validate: {
            notNull: { msg: "password hash needed" },
        },
    },
    role: {
        type: sequelize_1.DataTypes.STRING(20),
        validate: {
            isIn: {
                args: [["lesson_seeker", "admin", "sub_admin"]],
                msg: "out of role scope",
            },
            notNull: {
                msg: "role entry needed",
            },
        },
    },
}, {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
function syncModel() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield User.sync({ force: false });
            console.log("User model synced with the database.");
        }
        catch (error) {
            console.error("Error syncing the User model:", error);
        }
    });
}
syncModel();
module.exports = User;
