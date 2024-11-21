// const messageSchema = mongoose.Schema({
//     sender: { type: String, required: true },
//     message: { type: String, required: true, },
//     receiver: { type: String, required: true },
//     seen: { type: Boolean, default: false },
//     edited: { type: Boolean, default: false },
//     reactions: [{
//         reaction: String,
//         reactor: String,
//     }],
//     replyingTo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Message',
//         default: null
//     },
//     type: { type: String, required: true },
//     time: { type: String, required: true },
//     timestamp: { type: Date, default: Date.now }
// });
import { DataTypes, Model } from "sequelize";
import postgresConnectionSequelize from "../config/postgres";
import { messageInterface } from "../interfaces/messageInterface";
class MessageInt extends Model<messageInterface> implements messageInterface {
  public id!: string;
  public sender!: string;
  public message!: string;
  public receiver!: string;
  public seen!: boolean;
  public edited!: boolean;
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
    },
    edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
