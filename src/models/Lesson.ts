import { DataTypes, Model } from "sequelize";
import { lessonInterface } from "../interfaces/lessoninterface";
import postgresConnectionSequelize from "../config/postgres";
import Module from "./module";

class LessonInt extends Model<lessonInterface> implements lessonInterface {
  public id!: number;
  public image!: string;
  public content!: string;
  public moduleId!: number;
}

const Lesson = postgresConnectionSequelize.define<LessonInt>(
  "Lesson",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING,
    },
    moduleId: {
      type: DataTypes.INTEGER,
      references: {
        key: "id",
        model: Module,
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "Lesson",
    timestamps: true,
  }
);
Module.hasMany(Lesson, {
  sourceKey: "id",
  foreignKey: "moduleId",
  as: "lessons",
});
Lesson.belongsTo(Module, {
  targetKey: "id",
  foreignKey: "moduleId",
  as: "module",
});
export default Lesson;
