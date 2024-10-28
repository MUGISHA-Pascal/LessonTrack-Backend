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
const User_1 = __importDefault(require("./User"));
const postgres_1 = __importDefault(require("../config/postgres"));
const UserCourse = postgres_1.default.define("UserCourse", {
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "User ID is required.",
            },
            isInt: {
                msg: "User ID must be an integer.",
            },
        },
    },
    course_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Course ID is required.",
            },
            isInt: {
                msg: "Course ID must be an integer.",
            },
        },
    },
    enrollment_date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: "user_courses",
    timestamps: false,
});
UserCourse.belongsTo(User_1.default, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});
// UserCourse.belongsTo(Course, {
//   foreignKey: "course_id",
//   onDelete: "CASCADE",
// });
function syncModel() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield UserCourse.sync({ force: false });
            console.log("UserCourse model synced with the database.");
        }
        catch (error) {
            console.error("Error syncing the UserCourse model:", error);
        }
    });
}
syncModel();
