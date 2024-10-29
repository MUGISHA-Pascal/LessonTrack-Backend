import { DataTypes } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
const quiz = postgresConnectionSequelize.define(
  "quizzes",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    max_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
  },
  {
    createdAt: true,
    updatedAt: true,
  }
);

quiz.hasOne(Course, {
  foreignKey: "course_id",
  onDelete: "CASCADE",
});

quiz.sync();
export default quiz;
