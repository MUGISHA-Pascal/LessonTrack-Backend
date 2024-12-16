import { Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { LessonInterface } from "../interfaces/lessoninterface";

const { DataTypes } = require("sequelize");

class LessonInt extends Model<LessonInterface> implements LessonInterface {
  public id!: number;
  public course_id!: number;
  public title!: string;
  public content!: Text;
  public media_url!: string;
}

const Lesson = postgresConnectionSequelize.define<LessonInt>(
  "Lesson",
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    media_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "lessons",
    schema: "public",
    timestamps: false,
    createdAt: true,
    updatedAt: true,
  }
);

export default Lesson;
