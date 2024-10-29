import postgresConnectionSequelize from "../config/postgres";
import bcrypt from "bcrypt";
import { userInterface } from "../interfaces/userInterface";
const { DataTypes } = require("sequelize");
import { Model } from "sequelize";

class UserInterface extends Model<UserInterface> {
  public id!: number;
  public username!: string;
  public email!: string;
  public phone_number!: string;
  public password_hash!: string;
  public role!: "lesson_seeker" | "admin" | "sub_admin";
}

const User = postgresConnectionSequelize.define(
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    schema: "public",
    timestamps: false,
    hooks: {
      beforeSave: async (user: UserInterface) => {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      },
      beforeUpdate: async (user: UserInterface) => {
        if (user.changed("password_hash")) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
    },
  }
);

export default User;
