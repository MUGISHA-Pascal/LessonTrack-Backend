import { DataTypes } from "sequelize";
import User from "./User";
import postgresConnectionSequelize from "../config/postgres";
const UserCourse = postgresConnectionSequelize.define(
  "UserCourse",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User ID is required.",
        },
        isInt: {
          msg: "User ID must be an integer.",
        },
      },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Course ID is required.",
        },
        isInt: {
          msg: "Course ID must be an integer.",
        },
      },
    },
    enrollment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user_courses",
    timestamps: false,
  }
);

UserCourse.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
UserCourse.belongsTo(Course, {
  foreignKey: "course_id",
  onDelete: "CASCADE",
});

async function syncModel() {
  try {
    await UserCourse.sync({ force: false });
    console.log("UserCourse model synced with the database.");
  } catch (error) {
    console.error("Error syncing the UserCourse model:", error);
  }
}

syncModel();

export default UserCourse;
