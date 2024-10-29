import postgresConnectionSequelize from "../config/postgres";

const { DataTypes } = require("sequelize");

const Certificate = postgresConnectionSequelize.define(
  "Certificate",
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
    issued_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    certificate_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "certificates",
    schema: "public",
    timestamps: false,
  }
);

export default Certificate;
