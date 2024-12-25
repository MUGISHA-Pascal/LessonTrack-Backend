import { Model, DataTypes } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { questionInterface } from "../interfaces/questioninterface";

class QuestionInt
  extends Model<questionInterface>
  implements questionInterface
{
  public id!: number;
  public quiz_id!: number;
  public question!: string;
  public options!: string[];
  public correct_answer!: string;
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
      allowNull: false,
      references: {
        model: "quizzes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
    },
    correct_answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "questions",
    schema: "public",
    timestamps: false, // Disabling default Sequelize timestamps since `created_at` is manually handled
  }
);

export default Question;
