import { DataTypes, Model } from "sequelize";
import { fileInterface } from "../interfaces/FileInterface";
import postgresConnectionSequelize from "../config/postgres";

class FileInt extends Model<fileInterface> {
  public id!: string;
  public filename!: string;
  public mimetype!: string;
  public size!: string;
  public storagePath!: string;
  public sender!: string;
  public receiver!: string;
}

const File = postgresConnectionSequelize.define<FileInt>(
  "File",

  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    storagePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiver: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    schema: "public",
    tableName: "file",
  }
);

export default File;
