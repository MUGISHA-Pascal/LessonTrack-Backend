import { Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { commentInterface } from "../interfaces/commentinterface";

const { DataTypes } = require("sequelize");
class CommentInt extends Model<commentInterface> implements commentInterface {
  public id!: number;
  public user_id!: number;
  public course_id!: number;
  public comment_text!: Text;
}

const Comment = postgresConnectionSequelize.define<CommentInt>(
  "Comment",
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
      onDelete: "CASCADE",
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    createdAt: true,
    updatedAt: true,
    tableName: "comments",
    schema: "public",
    timestamps: false,
  }
);

export default Comment;
