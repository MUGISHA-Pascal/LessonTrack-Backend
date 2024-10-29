import postgresConnectionSequelize from "../config/postgres";

const { DataTypes } = require("sequelize");

const UserCourse = postgresConnectionSequelize.define(
  "UserCourse",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "CASCADE",
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "CASCADE",
      primaryKey: true,
    },
    enrollment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user_courses",
    schema: "public",
    timestamps: false,
  }
);

module.exports = UserCourse;
