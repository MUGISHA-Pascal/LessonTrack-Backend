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
  public profilepicture!: string;
  public nickname!: string;
  public gender!: string;
  public pin!: number;
  public verified!: string;
  public activestatus!: string;
  public special_offers!: boolean;
  public sound!: boolean;
  public vibrate!: boolean;
  public general_notification!: boolean;
  public promo_discount!: boolean;
  public payment_options!: boolean;
  public app_update!: boolean;
  public new_service_available!: boolean;
  public new_tips_available!: boolean;
  public device_token!: string;
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
      unique: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: false,
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
    profilepicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nickname: {
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
    activestatus: {
      type: DataTypes.STRING,
      defaultValue: "No",
      allowNull: true,
    },
    special_offers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sound: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    vibrate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    general_notification: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    promo_discount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    payment_options: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    app_update: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    new_service_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    new_tips_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    device_token: {
      type: DataTypes.STRING,
      allowNull: true,
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
