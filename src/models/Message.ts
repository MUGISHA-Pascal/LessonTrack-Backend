import { DataTypes, Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { messageInterface } from "../interfaces/messageInterface";
import User from "./User";
class MessageInt extends Model<messageInterface> implements messageInterface {
  public id!: string;
  public sender!: string;
  public message!: string;
  public receiver!: string;
  public seen!: boolean;
  public edited!: boolean;
  public date!: string;
  public repliedTo!: number[];
  public type!: string;
  public fileContent!: string | undefined;
}
const Message = postgresConnectionSequelize.define<MessageInt>(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    receiver: { type: DataTypes.STRING, allowNull: false },
    seen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repliedTo: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileContent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    schema: "public",
    tableName: "messages",
  }
);


export default Message;
