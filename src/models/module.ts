import { DataTypes, Model } from "sequelize";
import { moduleInterface } from "../interfaces/moduleInterface";
import postgresConnectionSequelize from "../config/postgres";
import Course from "./Courses";

class ModuleInt extends Model<moduleInterface> implements moduleInterface {
  public id!: number;
  public module!: string;
  public courseId!: number;
}
const Module = postgresConnectionSequelize.define<ModuleInt>(
  "Module",

  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    module: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      references: {
        key: "id",
        model: Course,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  }
);
Course.hasMany(Module, {
  foreignKey: "courseId",
  sourceKey: "id",
  as: "modules",
});
Module.belongsTo(Course, {
  targetKey: "id",
  foreignKey: "courseId",
  as: "course",
});
export default Module;
