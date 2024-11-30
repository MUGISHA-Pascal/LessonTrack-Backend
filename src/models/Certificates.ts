import { Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { certificateInterface } from "../interfaces/certificateinterface";

const { DataTypes } = require("sequelize");

class CertificateInt
  extends Model<certificateInterface>
  implements certificateInterface
{
  public id!: number;
  public user_id!: number;
  public course_id!: number;
  public issued_date!: Date;
  public certificate_url!: string;
}

const Certificate = postgresConnectionSequelize.define<CertificateInt>(
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
      type: DataTypes.STRING,
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
