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
