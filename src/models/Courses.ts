import { Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { courseInterface } from "../interfaces/courseinterface";

const { DataTypes } = require("sequelize");
class CourseInt extends Model<courseInterface> implements courseInterface {
  public id!: string;
  public title!: string;
  public description!: Text;
  public content_type!: "text" | "video" | "image";
  public created_by!: number;
  public is_active!: boolean;
}
const Course = postgresConnectionSequelize.define<CourseInt>(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [["text", "video", "image"]],
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "SET NULL",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    createdAt: true,
    updatedAt: true,
    tableName: "courses",
    schema: "public",
    timestamps: false,
  }
);

export default Course;
