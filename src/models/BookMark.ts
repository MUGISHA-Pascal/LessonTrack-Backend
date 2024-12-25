import { DataTypes, Model } from "sequelize";
import { BookMarkInterface } from "../interfaces/BookMarkInterface";
import postgresConnectionSequelize from "../config/postgres";

class BookMarkInt
  extends Model<BookMarkInterface>
  implements BookMarkInterface
{
  public userId!: number;
  public courseIds!: string[];
}


const BookMark = postgresConnectionSequelize.define<BookMarkInt>(
  "BookMark",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  { timestamps: true, tableName: "BookMark" }
);

export default BookMark;
