import { Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { questionInterface } from "../interfaces/questioninterface";

const { DataTypes } = require("sequelize");
class QuestionInt
  extends Model<questionInterface>
  implements questionInterface
{
  public id!: number;
  public quiz_id!: number;
  public question_text!: Text;
  public correct_answer!: Text;
}

const Question = postgresConnectionSequelize.define<QuestionInt>(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "quizzes",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "CASCADE",
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    correct_answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    createdAt: true,
    updatedAt: true,
    tableName: "questions",
    schema: "public",
    timestamps: false,
  }
);

export default Question;
