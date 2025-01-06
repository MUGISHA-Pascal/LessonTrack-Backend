import { DataTypes, Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { courseInterface } from "../interfaces/courseinterface";

class CourseInt extends Model<courseInterface> implements courseInterface {
  public id!: number;
  public title!: string;
  public description!: Text;
  public content_type!: "text" | "video" | "image" | "mixed";
  public created_by!: number;
  public category!: string;
  public is_active!: boolean;
  public module!: number[];
  public file!: string;
  public profile_image!: string;
  public userCount?: number | undefined;
  public ratingAverage?: number | undefined;
  public ratingCount?: number | undefined;
  public video?: string | undefined;
  public users?: number[] | undefined;
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
      allowNull: true,
      validate: {
        isIn: [["text", "video", "image"]],
      },
    },
    profile_image: { type: DataTypes.STRING, allowNull: true },
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
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    module: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    userCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ratingAverage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    users: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
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
