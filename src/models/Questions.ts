import { DataTypes } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import quiz from "./Quiz";

const Questions = postgresConnectionSequelize.define(
  "questions",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    quiz_id: {
      type: DataTypes.INTEGER,
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    correct_answer: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    createdAt: true,
    updatedAt: true,
  }
);
Questions.belongsTo(quiz, {
  foreignKey: "quiz_id",
  onUpdate: "NO ACTION",
  onDelete: "CASCADE",
});
