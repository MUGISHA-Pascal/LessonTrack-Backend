import { Sequelize } from "sequelize";
export const postgresConnectionSequelize = new Sequelize(
  "postgresql://pascal:3jK9zA11ecRw2AbiaKdICGbP2yzP1KJc@dpg-csl2egbv2p9s73aebpe0-a.oregon-postgres.render.com/lessontracker",
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

export default postgresConnectionSequelize;
