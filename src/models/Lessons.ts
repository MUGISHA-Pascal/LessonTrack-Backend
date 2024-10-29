import postgresConnectionSequelize from "../config/postgres";

const { DataTypes } = require("sequelize");

const Lesson = postgresConnectionSequelize.define(
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "lessons",
    schema: "public",
    timestamps: false,
  }
);
Lesson.belongsTo(Course, {
  foreignKey: "couse_id",
  onDelete: "CASCADE",
  onUpdate: "NO ACTION",
});

export default Lesson;
