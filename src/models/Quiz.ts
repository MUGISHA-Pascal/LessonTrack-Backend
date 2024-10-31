import { Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { quizinterface } from "../interfaces/quizinterface";

const { DataTypes } = require("sequelize");

class QuizInt extends Model<quizinterface> implements quizinterface {
  public id!: number;
  public course_id!: number;
  public title!: string;
  public max_attempts!: number;
}
const Quiz = postgresConnectionSequelize.define<QuizInt>(
  "Quiz",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "courses",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "CASCADE",
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
    tableName: "quizzes",
    schema: "public",
    timestamps: false,
    createdAt: true,
    updatedAt: true,
  }
);

export default Quiz;
