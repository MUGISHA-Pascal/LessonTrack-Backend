import { DataTypes } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";

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
      unique: true,
      validate: {
        notNull: { msg: "username is not assignable to null" },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      validate: {
        notNull: { msg: "username is not assignable to null" },
        isEmail: {
          msg: "email is not valid",
        },
      },
    },
    phone_number: {
      type: DataTypes.NUMBER,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      validate: {
        notNull: { msg: "password hash needed" },
      },
    },
    role: {
      type: DataTypes.STRING(20),
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
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

async function syncModel() {
  try {
    await User.sync({ force: false });
    console.log("User model synced with the database.");
  } catch (error) {
    console.error("Error syncing the User model:", error);
  }
}

syncModel();

export default User;
