import { Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { UserCourseInterface } from "../interfaces/usercourseinterface";

const { DataTypes } = require("sequelize");
class UserCourseInt
  extends Model<UserCourseInterface>
  implements UserCourseInterface
{
  public user_id!: number;
  public course_id!: number;
  public enrollment_date!: Date;
}
const UserCourse = postgresConnectionSequelize.define<UserCourseInt>(
  "UserCourse",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "CASCADE",
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "CASCADE",
      primaryKey: true,
    },
    enrollment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user_courses",
    schema: "public",
    timestamps: false,
  }
);

export default UserCourse;
