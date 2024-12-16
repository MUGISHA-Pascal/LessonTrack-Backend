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
const postgres_1 = __importDefault(require("../config/postgres"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { DataTypes } = require("sequelize");
const sequelize_1 = require("sequelize");
class UserInt extends sequelize_1.Model {
}
const User = postgres_1.default.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    phone_number: {
        type: DataTypes.STRING(15),
        allowNull: true,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [["lesson_seeker", "admin", "sub_admin"]],
        },
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nickName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pin: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    verified: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "NO",
    },
}, {
    createdAt: true,
    updatedAt: true,
    tableName: "users",
    schema: "public",
    timestamps: false,
    hooks: {
        beforeSave: (user) => __awaiter(void 0, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            user.password_hash = yield bcrypt_1.default.hash(user.password_hash, salt);
        }),
        beforeUpdate: (user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user.changed("password_hash")) {
                const salt = yield bcrypt_1.default.genSalt(10);
                user.password_hash = yield bcrypt_1.default.hash(user.password_hash, salt);
            }
        }),
    },
});
User.sync();
exports.default = User;
