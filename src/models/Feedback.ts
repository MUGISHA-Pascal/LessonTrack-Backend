import { Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { feedbackInterface } from "../interfaces/feedbackinterface";

const { DataTypes } = require("sequelize");
class FeedbackInt
  extends Model<feedbackInterface>
  implements feedbackInterface
{
  public id!: number;
  public user_id!: number;
  public course_id!: number;
  public feedback_text!: Text;
}

const Feedback = postgresConnectionSequelize.define<FeedbackInt>(
  "Feedback",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "CASCADE",
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "courses",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "SET NULL",
    },
    feedback_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    createdAt: true,
    updatedAt: true,
    tableName: "feedback",
    schema: "public",
    timestamps: false,
  }
);

export default Feedback;
