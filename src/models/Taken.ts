import { DataTypes, Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { takenInterface } from "../interfaces/takenInterface";

class TakenInt extends Model<takenInterface> implements takenInterface {
  public id!: number;
  public quiz!: number;
  public marks!: number;
  public status!: string;
  public userid!: number
}

const Taken = postgresConnectionSequelize.define<TakenInt>(
  "Taken",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    quiz: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Taken", // Optional, defines the table name explicitly if needed
    timestamps: false, // Set to true if you want `createdAt` and `updatedAt`
  }
);

export default Taken;
