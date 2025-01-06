import { DataTypes, Model } from "sequelize";
import { CourseTakenInterface } from "../interfaces/CourseTakenInterface";
import postgresConnectionSequelize from "../config/postgres";

class CourseTakenInt
  extends Model<CourseTakenInterface>
  implements CourseTakenInterface
{
  public userId!: number;
  public courseIds!: string[];
  public currentCourse!: string;
  public modules!:string;
  public indexx!: number;
}
const CourseTaken = postgresConnectionSequelize.define<CourseTakenInt>(
  "CourseTaken",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    currentCourse: {
      type: DataTypes.STRING,
    },
    modules:{
      type: DataTypes.STRING,

    }
    ,
    indexx:{
      type:DataTypes.INTEGER
    }
  },
  {
    timestamps: true,
    tableName: "CourseTaken",
  }
);
export default CourseTaken;
