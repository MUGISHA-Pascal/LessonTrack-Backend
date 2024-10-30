import postgresConnectionSequelize from "../config/postgres";
import bcrypt from "bcrypt";
import { userInterface } from "../interfaces/userInterface";
const { DataTypes } = require("sequelize");
import { Model } from "sequelize";

class UserInt extends Model<userInterface> {
  public id!: number;
  public username!: string;
  public email!: string;
  public phone_number!: string;
  public password_hash!: string;
  public role!: "lesson_seeker" | "admin" | "sub_admin";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const User = postgresConnectionSequelize.define<UserInt>(
  "User",
  {
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
  },
  {
    createdAt: true,
    updatedAt: true,
    tableName: "users",
    schema: "public",
    timestamps: false,
    hooks: {
      beforeSave: async (user: UserInt) => {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      },
      beforeUpdate: async (user: UserInt) => {
        if (user.changed("password_hash")) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
    },
  }
);
User.sync();

export default User;
