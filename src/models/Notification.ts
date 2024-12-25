import { DataTypes, Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { notificationInterface } from "../interfaces/notificationinterface";
class NotificationInt extends Model<notificationInterface> implements notificationInterface {
  public id!: string;
  public title!: string;
  public sender!: string;
  public description!: string;
  public receiver!: string;
  public sentdate!: string;
  public seen!:string;
  public pushed!:string
 
}
const Notification = postgresConnectionSequelize.define<NotificationInt>(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING(20),
      allowNull: false,
    
    },
    receiver: {
      type: DataTypes.STRING(20),
      allowNull: false,
    
    },
   
    sentdate: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    seen: {
      type: DataTypes.STRING,
      defaultValue: "No",
      allowNull:false
    },
    pushed:{
      type :DataTypes.STRING,
      defaultValue:"No",
      allowNull:false,
    }
  },
  {

    tableName: "notification",
    schema: "public",
    timestamps: false,
  }
);

export default Notification;
